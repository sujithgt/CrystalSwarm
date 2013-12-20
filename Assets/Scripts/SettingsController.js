#pragma strict

var musicSelection : UISelector;
var soundSelection : UISelector;
var currentSelection : UISelector;

var items : UIItem[];
var selectedItem : int = -2;
var selectedColor : Material;
var idleColor : Material;

var delay : float = .5f;
private var delayTime : float;

var menuController : MainMenuTransitionController;
var backLabel : ButtonLabel;

private var inputManager : InputManager;
private var gameStatus : GameStatus;

function Awake()
{
	inputManager = InputManager.Instance;
}

function Start()
{
	delayTime = delay;
}

function ShowMenu()
{
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
	Globals.LoadSettings();

	musicSelection.SetSelectionValue( Globals.musicVolume );
	soundSelection.SetSelectionValue( Globals.soundVolume );

	musicSelection.ChangeFocus(false);
	musicSelection.ActivateSelector(true, false);
	musicSelection.ActivateSelector(false, false);
	
	soundSelection.ChangeFocus(false);
	soundSelection.ActivateSelector(true, false);
	soundSelection.ActivateSelector(false, false);

	MoveSelection(0);

	backLabel.Show();
}

function StartMenu()
{
	enabled = true;
	delayTime = delay;
	currentSelection = musicSelection;
}

function StopMenu()
{
	Globals.SaveSettings();
	enabled = false;
}

function HideMenu()
{
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
		if( Input.GetAxis("P1X") >= .2f || Input.GetAxis("P2X") >= .2f || inputManager.GetKey(InputManager.IB_LEFT) )
		{
			ScrollSelection(-1);
		}
		else if( Input.GetAxis("P1X") <= -.2f || Input.GetAxis("P2X") <= -.2f || inputManager.GetKey(InputManager.IB_RIGHT) )
		{
			ScrollSelection(1);
		}

		if( Input.GetAxis("P1Y") >= .2f || Input.GetAxis("P2Y") >= .2f || inputManager.GetKey(InputManager.IB_DOWN) )
		{
			MoveSelection(1);
			delayTime = delay;
		}
		else if( Input.GetAxis("P1Y") <= -.2f || Input.GetAxis("P2Y") <= -.2f || inputManager.GetKey(InputManager.IB_UP) )
		{
			MoveSelection(-1);
			delayTime = delay;
		}
	}

	if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) || Mathf.Abs(Input.GetAxis("P1FireX")) > .5f
	 || Mathf.Abs(Input.GetAxis("P1FireY")) > .5f || Mathf.Abs(Input.GetAxis("P2FireX")) > .5f 
	 || Mathf.Abs(Input.GetAxis("P2FireY")) > .5f )
	{
		AcceptSelection();
	}

	if( selectedItem < 0 && selectedItem > -3 )
	{
		if( Input.GetAxis("P1X") <= -.2f || Input.GetAxis("P2X") <= -.2f || inputManager.GetKey(InputManager.IB_RIGHT) )
		{
			currentSelection.ActivateSelector(false, true);
		}
		else
		{
			currentSelection.ActivateSelector(false, false);
		}
		if( Input.GetAxis("P1X") >= .2f || Input.GetAxis("P2X") >= .2f || inputManager.GetKey(InputManager.IB_LEFT) )
		{
			currentSelection.ActivateSelector(true, true);
		}
		else
		{
			currentSelection.ActivateSelector(true, false);
		}
	}
}

function BackPressed()
{
	menuController.StartTitleMenu();
}

private function MoveSelection( direction : int )
{
	if( selectedItem > -3 && selectedItem < items.Length )
	{
		SetSelection( selectedItem + direction + 2 );
	}
	else
	{
		if( direction > 0 )
		{
			SetSelection( 0 );
		}
		else
		{
			SetSelection( items.Length + 1 );
		}
	}
}

function ScrollSelection( direction : int )
{
	if( delayTime <= 0f && selectedItem < 0 && selectedItem > -3 )
	{
		currentSelection.MoveSelection(direction);
		if( selectedItem == -2 )
		{
			gameStatus.UpdateMusicVolume();
		}
		if( selectedItem == -1 )
		{
			gameStatus.PlayMenuSound();
		}
		delayTime = delay;
	}
}

function SetSelection( index : int )
{
	if( selectedItem > -3 && selectedItem < items.Length )
	{
		if( selectedItem < 0 )
		{
			currentSelection.ChangeFocus(false);
			currentSelection.ActivateSelector(true, false);
			currentSelection.ActivateSelector(false, false);
		}
		else
		{
			items[selectedItem].SetColor(idleColor, false);
		}
	}

	//make sure index is between 0 and length+2
	if( (index < items.Length+2) && (index >= 0) )
	{
		selectedItem = index - 2;
	}
	
	if( selectedItem > -3 && selectedItem < items.Length )
	{
		if( selectedItem < 0 )
		{
			if( selectedItem == -2 )
			{
				currentSelection = musicSelection;
			}
			if( selectedItem == -1 )
			{
				currentSelection = soundSelection;
			}
			currentSelection.ChangeFocus(true);
		}
		else
		{
			items[selectedItem].SetColor(selectedColor, true);
		}
	}
}

function ClearSelection()
{
	if( selectedItem > -3 && selectedItem < items.Length )
	{
		if( selectedItem < 0 )
		{
			currentSelection.ChangeFocus(false);
			currentSelection.ActivateSelector(true, false);
			currentSelection.ActivateSelector(false, false);
		}
		else
		{
			items[selectedItem].SetColor(idleColor, false);
		}
	}
	
	selectedItem = -3;
}

function AcceptSelection()
{
	if( selectedItem >= 0 && selectedItem < items.Length )
	{
		gameStatus.PlayMenuSound();
		menuController.StartTransition(this.gameObject, items[selectedItem].GetComponent(UIItem).GetObject());
	}
}
