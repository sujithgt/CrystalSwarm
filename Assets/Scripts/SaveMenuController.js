#pragma strict

var slot1 : SaveSlot;
var slot2 : SaveSlot;
var slot3 : SaveSlot;

var upArrow : MainMenuTextureObject;
var downArrow : MainMenuTextureObject;

var minSlot : int = 0;
var maxSlot : int = 9;
private var activeSelection : boolean;
private var curSlot : int = minSlot;
private var curCenterDistance : int;
private var allowArrowFocus : boolean = false;

var delay : float = .5f;
private var delayTime : float;

var backMenu : GameObject;
var backLabel : ButtonLabel;

private var inputManager : InputManager;
private var menuTransition : MainMenuTransitionController;
private var gameStatus : GameStatus;

var detailsMenu : DetailsMenuController;

function Awake()
{
	inputManager = InputManager.Instance;
	menuTransition = GameObject.Find("TransitionController").GetComponent(MainMenuTransitionController);
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
}

function ShowMenu()
{
	PrepareMenuDisplay();

	UpdateSelectors();
	
	activeSelection = true;
	SelectedSlot().BroadcastMessage("SetFocus", true);

	backLabel.Show();
}

function StartMenu()
{
	enabled = true;
	delayTime = delay;
	allowArrowFocus = false;
}

function StopMenu()
{
	enabled = false;
}

function HideMenu()
{
	upArrow.renderer.enabled = false;
	downArrow.renderer.enabled = false;
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
	if( (Mathf.Abs(Input.GetAxis("P1Y")) < .2f) && (Mathf.Abs(Input.GetAxis("P2Y")) < .2f) 
	 && (Mathf.Abs(Input.GetAxis("P1X")) < .2f) && (Mathf.Abs(Input.GetAxis("P2X")) < .2f) 
	 && !inputManager.GetKey(InputManager.IB_MOVE) )
	{
		delayTime = 0f;
	}
	
	if( delayTime <= 0f )
	{
		allowArrowFocus = true;
		
		if( (Input.GetAxis("P1Y") >= .2f) || (Input.GetAxis("P2Y") >= .2f) || inputManager.GetKey(InputManager.IB_DOWN) )
		{
			MoveSelection(1);
			delayTime = delay;
		}
		else if( (Input.GetAxis("P1Y") <= -.2f) || (Input.GetAxis("P2Y") <= -.2f) || inputManager.GetKey(InputManager.IB_UP) )
		{
			MoveSelection(-1);
			delayTime = delay;
		}
	}
	
	// only do one of these per frame to avoid strange menu overlaps
	if( (Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f) 
	 || (Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f)
	 || inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) )
	{
		AcceptSelection();
	}
	else if( inputManager.GetKeyReleased(InputManager.IB_MENUDETAILS) || Input.GetKeyUp(KeyCode.Equals) )
	{
		if( !SelectedSlot().isEmpty )
		{
			gameStatus.PlayMenuSound();
			detailsMenu.SetSlot( SelectedSlot() );
			menuTransition.StartTransition( this.gameObject, detailsMenu.gameObject );
		}
	}
	else if( inputManager.GetKeyReleased(InputManager.IB_MENUDELETE) || Input.GetKeyUp(KeyCode.Delete) )
	{
		if( !SelectedSlot().isEmpty )
		{
			gameStatus.PlayMenuSound();
			SelectedSlot().DeleteSaveData();
		}
	}

	downArrow.SetFocus( (allowArrowFocus) && ((Input.GetAxis("P1Y") >= .2f) || (Input.GetAxis("P2Y") >= .2f) || inputManager.GetKey(InputManager.IB_DOWN)) );
	upArrow.SetFocus( (allowArrowFocus) && ((Input.GetAxis("P1Y") <= -.2f) || (Input.GetAxis("P2Y") <= -.2f) || inputManager.GetKey(InputManager.IB_UP)) );
}

function StartGame()
{
	gameStatus.LoadSave( SelectedSlot() );

	var playerStatus : PlayerMenuController = GameObject.Find("PlayerStatusDisplay").GetComponent(PlayerMenuController);
	playerStatus.SendJoinStatus( gameStatus );
	playerStatus.ReportGameStart( gameStatus, false );

	Application.LoadLevel("GameLevel");
}

function BackPressed()
{
	if( enabled )
	{
		menuTransition.StartTransition( this.gameObject, backMenu );
	}
	else
	{
		SelectedSlot().BackPressed();
	}
}

private function PrepareMenuDisplay()
{
	curCenterDistance = 0;
	if( curSlot == minSlot )
	{
		curCenterDistance = 1;
	}
	if( curSlot == maxSlot )
	{
		curCenterDistance = -1;
	}
	
	slot1.Load( curSlot + curCenterDistance - 1);
	slot2.Load( curSlot + curCenterDistance );
	slot3.Load( curSlot + curCenterDistance + 1 );
}

private function UpdateSelectors()
{
	upArrow.renderer.enabled = ((curSlot + curCenterDistance - 1) != minSlot);
	downArrow.renderer.enabled = ((curSlot + curCenterDistance + 1) != maxSlot);
}

private function SelectedSlot() : SaveSlot
{
	if( activeSelection )
	{
		if( curCenterDistance == 1 )
		{
			return slot1;
		}
		if( curCenterDistance == 0 )
		{
			return slot2;
		}
		if( curCenterDistance == -1 )
		{
			return slot3;
		}
		return null;
	}
	return null;
}

private function MoveSelection( direction : int )
{
	if( !activeSelection )
	{
		if( direction < 0 )
		{
			SetSelection(2);
		}
		else
		{
			SetSelection(0);
		}
	}
	else
	{
		if( direction == curCenterDistance )
		{
			SetSelection(1);
		}
		else
		{
			if( direction > 0 )
			{
				if( curSlot + curCenterDistance + 1 < maxSlot )
				{
					ScrollMenu(direction);
					SetSelection(1 - curCenterDistance);
				}
				else
				{
					if( curCenterDistance == 0 )
					{
						SetSelection( 2 );
					}
				}
			}
			else if( direction < 0 )
			{
				if( curSlot + curCenterDistance - 1 > minSlot )
				{
					ScrollMenu(direction);
					SetSelection(1 - curCenterDistance);
				}
				else
				{
					if( curCenterDistance == 0 )
					{
						SetSelection( 0 );
					}
				}
			}
		}
	}
}

function ScrollMenu( direction : int )
{
	if( ((direction > 0) && (curSlot + curCenterDistance + 1 < maxSlot))
	 || ((direction < 0) && (curSlot + curCenterDistance - 1 > minSlot)))
	{
		ClearSelection();
		
		curSlot += direction;
		
		slot1.Load( curSlot + curCenterDistance - 1);
		slot2.Load( curSlot + curCenterDistance );
		slot3.Load( curSlot + curCenterDistance + 1 );

		UpdateSelectors();
	}
}

// repurposed scrolling for the details / delete buttons in this menu
// scrolling left is the details button, right is the delete button
function ScrollSelection( direction : int )
{
	if( !SelectedSlot().isEmpty )
	{
		gameStatus.PlayMenuSound();
		
		if( direction == -1 )
		{
			detailsMenu.SetSlot( SelectedSlot() );
			menuTransition.StartTransition( this.gameObject, detailsMenu.gameObject );
		}
		if( direction == 1 )
		{
			SelectedSlot().DeleteSaveData();
		}
	}
}

function SetSelection( index : int )
{
	ClearSelection();

	activeSelection = true;
	curSlot += index + curCenterDistance - 1;
	curCenterDistance = 1 - index;
	
	if( curCenterDistance == 1 )
	{
		slot1.gameObject.BroadcastMessage("SetFocus", true);
	}
	if( curCenterDistance == 0 )
	{
		slot2.gameObject.BroadcastMessage("SetFocus", true);
	}
	if( curCenterDistance == -1 )
	{
		slot3.gameObject.BroadcastMessage("SetFocus", true);
	}
}

function ClearSelection()
{
	activeSelection = false;
	
	if( curCenterDistance == 1 )
	{
		slot1.gameObject.BroadcastMessage("SetFocus", false);
	}
	if( curCenterDistance == 0 )
	{
		slot2.gameObject.BroadcastMessage("SetFocus", false);
	}
	if( curCenterDistance == -1 )
	{
		slot3.gameObject.BroadcastMessage("SetFocus", false);
	}
}

function AcceptSelection()
{
	if( activeSelection )
	{
		gameStatus.PlayMenuSound();
		
		if( SelectedSlot().isEmpty )
		{
			SelectedSlot().CreateSaveData();
		}
		else
		{
			if( SelectedSlot().wave < Globals.MAX_WAVES && SelectedSlot().ratingTotal >= Globals.TIER_REQUIREMENT[SelectedSlot().difficulty][SelectedSlot().wave/Globals.TIER_SIZE] )
			{
				SelectedSlot().SelectPlayers();
			}
			else
			{
				detailsMenu.SetSlot( SelectedSlot() );
				menuTransition.StartTransition( this.gameObject, detailsMenu.gameObject );
			}
		}
	}
}

function PrepareDetailSlot( slot : int )
{
	activeSelection = true;
	curSlot = slot;
	PrepareMenuDisplay();
	this.gameObject.BroadcastMessage("HideMenu");
	detailsMenu.SetSlot( SelectedSlot() );
}
