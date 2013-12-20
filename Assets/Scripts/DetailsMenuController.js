#pragma strict

//save information
var saveData : SaveSlot;
var ratings : char[];

//details display
var detailText : TextMesh;
var textRenderer : MeshRenderer;

//wave displays
var selectedIndex : int = 0;
var detailWaveOffset : int = 0;
var waveDisplays : DetailWaveDisplay[];
var tierDisplays : DetailTierDisplay[];
private var selectingWave : boolean;

//scrolling information
var rowSize : int = 5;		// it is assumed that this is half of the tier size
var scrollEdge : int = 5;

//ratings char to int silliness
var ratingBase : int = "0"[0];
var curRating : int;

//selection movement delay
var delay : float = .5f;
private var delayTime : float;

//scroll icons
var upSelector : MeshRenderer;
var downSelector : MeshRenderer;

var selectorIdleMaterial : Material;
var selectorActiveMaterial : Material;

//external communication
private var inputManager : InputManager = null;
private var gameStatus : GameStatus = null;

//menu data
var menuController : MainMenuTransitionController;
var backMenu : GameObject;
var backLabel : ButtonLabel;

function Awake()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
}

function SetSlot( slot : SaveSlot )
{
	if( gameStatus == null )
	{
		inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
		gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
	}

	saveData = slot;
	ratings = saveData.ratings.ToCharArray(0,Globals.MAX_WAVES);
	
	var nextWaveLocked : boolean = false;
	var useWave = (gameStatus.detailsWave != -1) ? (gameStatus.detailsWave) : (saveData.wave);

	waveDisplays[selectedIndex].SetSelected(false);
	tierDisplays[selectedIndex / 10].SetSelected(false);

	detailWaveOffset = (useWave-1) - ((useWave-1) % Globals.TIER_SIZE);
	detailWaveOffset = Mathf.Min(detailWaveOffset, Globals.MAX_WAVES - waveDisplays.Length);
	selectedIndex = useWave - detailWaveOffset - 1;

	if( useWave < Globals.MAX_WAVES && saveData.ratingTotal < Globals.TIER_REQUIREMENT[saveData.difficulty][(detailWaveOffset + selectedIndex) / Globals.TIER_SIZE] )
	{
		nextWaveLocked = true;
		detailWaveOffset -= Globals.TIER_SIZE;
		selectedIndex += Globals.TIER_SIZE - 1;
	}

	UpdateScrolling();

	if( nextWaveLocked )
	{
		selectedIndex = Globals.TIER_SIZE - 1;
	}
	else
	{
		selectedIndex = useWave - detailWaveOffset - 1;
		if( selectedIndex >= waveDisplays.Length )
		{
			selectedIndex = waveDisplays.Length - 1;
		}
	}

	UpdateDetailsText();
	if( selectingWave )
	{
		waveDisplays[selectedIndex].SetSelected(true);
	}
	else
	{
		tierDisplays[selectedIndex / 10].SetSelected(true);
	}
}

function ShowMenu()
{
	//set up selectors
	upSelector.gameObject.SetActive(true);
	downSelector.gameObject.SetActive(true);
	upSelector.material = selectorIdleMaterial;
	downSelector.material = selectorIdleMaterial;

	var i : int;
	
	for( i = 0 ; i < waveDisplays.Length ; ++i )
	{
		waveDisplays[i].ShowMenu();
	}
	for( i = 0 ; i < tierDisplays.Length ; ++i )
	{
		tierDisplays[i].ShowMenu();
	}
	
	textRenderer.enabled = true;
	backLabel.Show();
}

function StartMenu()
{
	delayTime = delay;
	enabled = true;
}

function StopMenu()
{
	upSelector.renderer.enabled = false;
	downSelector.renderer.enabled = false;
	enabled = false;
}

function HideMenu()
{
	upSelector.gameObject.SetActive(true);
	downSelector.gameObject.SetActive(true);

	for( var i : int = 0 ; i < waveDisplays.Length ; ++i )
	{
		waveDisplays[i].HideMenu();
	}
	textRenderer.enabled = false;
	backLabel.Hide();
}

function Update()
{
	delayTime -= Time.deltaTime;

	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) )
	{
		BackPressed();
		return;
	}

	//remove the input delay if all axes are released
	if( Mathf.Abs(Input.GetAxis("P1X")) < .2f && Mathf.Abs(Input.GetAxis("P2X")) < .2f 
	 && Mathf.Abs(Input.GetAxis("P1Y")) < .2f && Mathf.Abs(Input.GetAxis("P2Y")) < .2f 
	 && !inputManager.GetKey(InputManager.IB_MOVE) )
	{
		delayTime = 0f;
	}
	
	if( delayTime <= 0f )
	{
		var selectionChanged : boolean = false;
		
		//ignore left/right motion if a tier is selected
		if( selectingWave )
		{
			if( Input.GetAxis("P1X") >= .2f || Input.GetAxis("P2X") >= .2f || inputManager.GetKey(InputManager.IB_LEFT) )
			{
				if( (selectedIndex % rowSize) > 0 )
				{
					if( !selectionChanged )
					{
						waveDisplays[selectedIndex].SetSelected(false);
						selectionChanged = true;
					}
					--selectedIndex;
				}
			}
			else if( Input.GetAxis("P1X") <= -.2f || Input.GetAxis("P2X") <= -.2f || inputManager.GetKey(InputManager.IB_RIGHT) )
			{
				if( (selectedIndex % rowSize) < (rowSize - 1) )
				{
					if( !selectionChanged )
					{
						waveDisplays[selectedIndex].SetSelected(false);
						selectionChanged = true;
					}
					++selectedIndex;
				}
			}
		}

		if( Input.GetAxis("P1Y") >= .2f || Input.GetAxis("P2Y") >= .2f || inputManager.GetKey(InputManager.IB_DOWN) )
		{
			if( selectedIndex >= Globals.TIER_SIZE )
			{
				selectionChanged = ScrollMenu(2);
				// if going from a locked selection to a locked selection, scroll 2 rows
				if( !selectingWave && selectionChanged )
				{
					selectedIndex += rowSize;
				}
				// if the last tier is unlocked, move down to its bottom row
				if( selectingWave && !selectionChanged && selectedIndex + rowSize < waveDisplays.Length )
				{
					waveDisplays[selectedIndex].SetSelected(false);
					selectedIndex += rowSize;
					selectionChanged = true;
				}
			}
			else if( selectedIndex + detailWaveOffset + rowSize < Globals.MAX_WAVES )
			{
				waveDisplays[selectedIndex].SetSelected(false);
				selectedIndex += rowSize;
				selectionChanged = true;
			}
		}
		else if( Input.GetAxis("P1Y") <= -.2f || Input.GetAxis("P2Y") <= -.2f || inputManager.GetKey(InputManager.IB_UP) )
		{
			if( selectedIndex < Globals.TIER_SIZE )
			{
				selectionChanged = ScrollMenu(-2);
				// if in the top tier, move to its top row
				if( !selectionChanged && selectedIndex - rowSize >= 0 )
				{
					waveDisplays[selectedIndex].SetSelected(false);
					selectedIndex -= rowSize;
					selectionChanged = true;
				}
			}
			else if( tierDisplays[0].locked && tierDisplays[1].locked )
			{
				selectionChanged = ScrollMenu(-2);
				selectedIndex -= rowSize;
			}
			else if( selectedIndex + detailWaveOffset - rowSize >= 0 )
			{
				waveDisplays[selectedIndex].SetSelected(false);
				tierDisplays[selectedIndex / 10].SetSelected(false);
				selectedIndex -= rowSize;
				selectionChanged = true;
			}
		}

		if( selectionChanged )
		{
			delayTime = delay;
			UpdateDetailsText();
			if( selectingWave )
			{
				waveDisplays[selectedIndex].SetSelected(true);
			}
			else
			{
				tierDisplays[selectedIndex / 10].SetSelected(true);
			}
		}
	}

	if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) || Mathf.Abs(Input.GetAxis("P1FireX")) > .5f
	 || Mathf.Abs(Input.GetAxis("P1FireY")) > .5f || Mathf.Abs(Input.GetAxis("P2FireX")) > .5f 
	 || Mathf.Abs(Input.GetAxis("P2FireY")) > .5f )
	{
		AcceptSelection();
	}

	if( Input.GetAxis("P1Y") >= .2f || Input.GetAxis("P2Y") >= .2f || inputManager.GetKey(InputManager.IB_DOWN) )
	{
		downSelector.material = selectorActiveMaterial;
	}
	else
	{
		downSelector.material = selectorIdleMaterial;
	}
	if( Input.GetAxis("P1Y") <= -.2f || Input.GetAxis("P2Y") <= -.2f || inputManager.GetKey(InputManager.IB_UP) )
	{
		upSelector.material = selectorActiveMaterial;
	}
	else
	{
		upSelector.material = selectorIdleMaterial;
	}
}

function BackPressed()
{
	menuController.StartTransition(this.gameObject, backMenu);
}

function ScrollMenu( direction : int ) : boolean
{
	var selectionChanged : boolean = false;
	
	if( direction > 0 )
	{
		if( (detailWaveOffset+selectedIndex+(rowSize*direction)) < Globals.MAX_WAVES )
		{
			if( !selectionChanged )
			{
				waveDisplays[selectedIndex].SetSelected(false);
				tierDisplays[selectedIndex / 10].SetSelected(false);
				selectionChanged = true;
			}
			detailWaveOffset += rowSize * direction;
			selectedIndex -= rowSize * (direction - 1);
			UpdateScrolling();
			delayTime = delay;
		}
	}
	
	if( direction < 0 )
	{
		if( detailWaveOffset+selectedIndex >= (rowSize*-direction) )
		{
			if( !selectionChanged )
			{
				waveDisplays[selectedIndex].SetSelected(false);
				tierDisplays[selectedIndex / 10].SetSelected(false);
				selectionChanged = true;
			}
			detailWaveOffset += rowSize * direction;
			selectedIndex -= rowSize * (direction + 1);
			UpdateScrolling();
			delayTime = delay;
		}
	}
	
	//with touch the selection may move off-screen, bring it back in bounds
	while( selectedIndex < 0 )
	{
		selectedIndex += rowSize;
	}
	while( selectedIndex >= waveDisplays.Length )
	{
		selectedIndex -= rowSize;
	}
	
	return selectionChanged;
}

function SetSelection( index : int )
{
	waveDisplays[selectedIndex].SetSelected(false);
	tierDisplays[selectedIndex / 10].SetSelected(false);
	selectedIndex = index;

	UpdateDetailsText();
	if( selectingWave )
	{
		waveDisplays[selectedIndex].SetSelected(true);
	}
	else
	{
		tierDisplays[selectedIndex / 10].SetSelected(true);
	}
}

function ClearSelection()
{
	//dont allow this selection to be cleared
}

function AcceptSelection()
{
	if( !waveDisplays[selectedIndex].Locked() )
	{
		gameStatus.PlayMenuSound();
		gameStatus.LoadSave( saveData );
		gameStatus.SetStartingWave( 1 + selectedIndex + detailWaveOffset );
		
		var playerStatus : PlayerMenuController = GameObject.Find("PlayerStatusDisplay").GetComponent(PlayerMenuController);
		playerStatus.SendJoinStatus( gameStatus );
		playerStatus.ReportGameStart( gameStatus, true );

		Application.LoadLevel("GameLevel");
	}
}

private function UpdateScrolling()
{
	var val : int;

	/* with tiers, dont offset scrolling by the edge values
	if( (selectedIndex < scrollEdge) && (detailWaveOffset > 0) )
	{
		selectedIndex += scrollEdge;
		detailWaveOffset -= scrollEdge;
	}
	else if( (selectedIndex >= (waveDisplays.Length - scrollEdge)) && (detailWaveOffset < (Globals.MAX_WAVES - waveDisplays.Length)) )
	{
		selectedIndex -= scrollEdge;
		detailWaveOffset += scrollEdge;
	}
	*/

	if( detailWaveOffset < 0 )
	{
		selectedIndex -= detailWaveOffset;
		detailWaveOffset -= detailWaveOffset;
	}
	
	if( detailWaveOffset > (Globals.MAX_WAVES - waveDisplays.Length) )
	{
		val = (detailWaveOffset + waveDisplays.Length - Globals.MAX_WAVES);
		selectedIndex -= val;
		detailWaveOffset -= val;
	}
	
	var tierLocked : boolean = false;
	for( val = 0 ; val < waveDisplays.Length ; ++val )
	{
		if( val % Globals.TIER_SIZE == 0 )
		{
			tierLocked = tierDisplays[val/10].SetTier((val + detailWaveOffset) / 10, saveData);
		}

		if( tierLocked )
		{
			waveDisplays[val].SetLevel(val + detailWaveOffset, DetailWaveDisplay.CRYSTALS_TIER_LOCKED);
		}
		else
		{
			curRating = ratings[val + detailWaveOffset];
			if( val+detailWaveOffset < saveData.wave )
			{
				waveDisplays[val].SetLevel(val + detailWaveOffset, curRating - ratingBase);
			}
			else
			{
				waveDisplays[val].SetLevel(val + detailWaveOffset, DetailWaveDisplay.CRYSTALS_WAVE_LOCKED );
			}
		}
	}
	
	upSelector.renderer.enabled = (detailWaveOffset > 0);
	downSelector.renderer.enabled = ((detailWaveOffset + waveDisplays.Length) < Mathf.Min(saveData.wave, Globals.MAX_WAVES));
}

private function UpdateDetailsText()
{
	var targetTime : int = DescentSpawnEquations.descentTimes[detailWaveOffset + selectedIndex];
	var targetEfc : float = DescentSpawnEquations.descentEfficiency[detailWaveOffset + selectedIndex];
	var givenLives : int = DescentSpawnEquations.descentLives[detailWaveOffset + selectedIndex];

	if( saveData.ratingTotal >= Globals.TIER_REQUIREMENT[saveData.difficulty][(detailWaveOffset + selectedIndex) / Globals.TIER_SIZE] )
	{
		selectingWave = true;
		detailText.text = "Wave " + (detailWaveOffset + selectedIndex + 1) + "\n\n";
	
		if( detailWaveOffset + selectedIndex + 1 <= saveData.wave )
		{
			detailText.text += "Targets:\n\nTime - " + (targetTime / 60) + ":" 
				+ (targetTime % 60).ToString("#00") + "\nLives- " + (2)
				+ "\nEfc. - " + targetEfc.ToString("#0.0");
		}
		else
		{
			detailText.text += "Locked";
		}
	}
	else
	{
		selectingWave = false;
		detailText.text = "Tier " + (1 + ((detailWaveOffset + selectedIndex)/10)) + "\n\nLocked";
	}
}

/*
private function EndOfRow( index : int ) : int
{
	var end : int = rowSize;
	
	while( saveData.wave >= end )
	{
		end += rowSize;
	}
	
	return end;
}

private function TopOfTier( index : int ) : boolean
{
	//make sure this works with negative numbers too, may get up to -Globals.TIER_SIZE
	return ((index + Globals.TIER_SIZE) % Globals.TIER_SIZE) < rowSize;
}
*/
