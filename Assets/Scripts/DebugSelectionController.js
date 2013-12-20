#pragma strict

var startWaveTitle : GameObject;
var startWaveSelector : NameEntryText;
var bossSelection : UISelector;
var testSelection : UISelector;

var unselectedTextColor : Material;
var selectedTextColor : Material;

private var currentSelection : UISelector;

var delay : float = .2f;
private var delayTime : float;

var menuController : MainMenuTransitionController;
var backMenu : GameObject;
var backLabel : ButtonLabel;

var playerSelectionMenu : GameObject;
var saveSelectionMenu : GameObject;
private var gameStatus : GameObject;

private var inputManager : InputManager;

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
	backLabel.Show();
}

function StartMenu()
{
	enabled = true;
	delayTime = delay;
	
	gameStatus = GameObject.Find("GameStatus");
	
	if( currentSelection )
	{
		currentSelection.ChangeFocus(false);
		currentSelection = null;
	}
	
	startWaveTitle.renderer.material = selectedTextColor;
	startWaveSelector.renderer.material = selectedTextColor;
}

function StopMenu()
{
	enabled = false;
	
	if( currentSelection != null )
	{
		currentSelection.GetSelectionInformation(gameStatus);
	}
}

function HideMenu()
{
	backLabel.Hide();
}

function Update()
{
	delayTime -= Time.deltaTime;

	//remove the input delay if all axes are released
	if( Mathf.Abs(Input.GetAxis("P1X")) < .2f && Mathf.Abs(Input.GetAxis("P2X")) < .2f 
	 && Mathf.Abs(Input.GetAxis("P1Y")) < .2f && Mathf.Abs(Input.GetAxis("P2Y")) < .2f
	 && !inputManager.GetKey(InputManager.IB_MOVE) && !inputManager.GetKey(InputManager.IB_FIRE)
	 && Mathf.Abs(Input.GetAxis("P1FireX")) < .2f && Mathf.Abs(Input.GetAxis("P1FireY")) < .2f
	 && Mathf.Abs(Input.GetAxis("P2FireX")) < .2f && Mathf.Abs(Input.GetAxis("P2FireY")) < .2f )
	{
		delayTime = 0f;
	}
	
	if( delayTime <= 0f )
	{
		if( currentSelection != null )
		{
			if( Input.GetAxis("P1X") <= -.2f || Input.GetAxis("P2X") <= -.2f || inputManager.GetKey(InputManager.IB_RIGHT) )
			{
				currentSelection.MoveSelection(1);
				delayTime = delay;
			}
			else if( Input.GetAxis("P1X") >= .2f || Input.GetAxis("P2X") >= .2f || inputManager.GetKey(InputManager.IB_LEFT) )
			{
				currentSelection.MoveSelection(-1);
				delayTime = delay;
			}
		}

		if( Input.GetAxis("P1Y") >= .2f || Input.GetAxis("P2Y") >= .2f || inputManager.GetKey(InputManager.IB_DOWN) )
		{
			if( currentSelection != null )
			{
				currentSelection.ChangeFocus(false);
			}
			else
			{
				startWaveTitle.renderer.material = unselectedTextColor;
				startWaveSelector.renderer.material = unselectedTextColor;
			}
			
			if( currentSelection == null )
			{
				currentSelection = bossSelection;
			}
			else if( currentSelection == bossSelection )
			{
				currentSelection = testSelection;
			}

			currentSelection.ChangeFocus(true);
			delayTime = delay;
		}
		else if( Input.GetAxis("P1Y") <= -.2f || Input.GetAxis("P2Y") <= -.2f || inputManager.GetKey(InputManager.IB_UP) )
		{
			if( currentSelection != null )
			{
				currentSelection.ChangeFocus(false);
			}
				
			if( currentSelection == bossSelection )
			{
				currentSelection = null;
			}
			else if( currentSelection == testSelection )
			{
				currentSelection = bossSelection;
			}

			if( currentSelection != null )
			{
				currentSelection.ChangeFocus(true);
			}
			else
			{
				startWaveTitle.renderer.material = selectedTextColor;
				startWaveSelector.renderer.material = selectedTextColor;
			}
			delayTime = delay;
		}

		if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) || Mathf.Abs(Input.GetAxis("P1FireX")) > .5f
		 || Mathf.Abs(Input.GetAxis("P1FireY")) > .5f || Mathf.Abs(Input.GetAxis("P2FireX")) > .5f 
		 || Mathf.Abs(Input.GetAxis("P2FireY")) > .5f )
		{
			if( currentSelection == null )
			{
				startWaveSelector.StartTextInput(1,0,0);
				enabled = false;
			}
			else
			{
				menuController.StartTransition( this.gameObject, playerSelectionMenu );
			}
		}
	}
	
	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) )
	{
		menuController.StartTransition(this.gameObject, backMenu);
	}
}

function NameInputFinished( pl : int )
{
	enabled = true;
	delayTime = delay;
}

function NameInputCancelled( pl : int )
{
	enabled = true;
	delayTime = delay;
}
