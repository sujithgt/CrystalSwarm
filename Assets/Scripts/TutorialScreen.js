#pragma strict

private var inputManager : InputManager;

var menuController : MainMenuTransitionController;
var backMenu : GameObject;
var nextScreen : GameObject;
var backLabel : ButtonLabel;

var touch : boolean;

function Awake()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
	touch = false;
}

function Update()
{
	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) )
	{
		BackPressed();
		return;
	}

	if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) || Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f 
	 || Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f || Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f
	 || Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f )
	{
		GameObject.Find("GameStatus").GetComponent(GameStatus).PlayMenuSound();
		menuController.StartTransition(this.gameObject, nextScreen);
	}
}

function LateUpdate()
{
	// process touch events in LateUpdate so that a touch event from the back
	// button will go through first
	
	if( Input.touchCount > 0 )
	{
		touch = true;
	}
	
	if( touch && Input.touchCount == 0 )
	{
		GameObject.Find("GameStatus").GetComponent(GameStatus).PlayMenuSound();
		menuController.StartTransition(this.gameObject, nextScreen);
	}
}

function ShowMenu()
{
	backLabel.Show();
}

function StartMenu()
{
	enabled = true;
	touch = false;
}

function StopMenu()
{
	enabled = false;
}

function HideMenu()
{
	backLabel.Hide();
}

function BackPressed()
{
	menuController.StartTransition(this.gameObject, backMenu);
}
