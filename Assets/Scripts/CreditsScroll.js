#pragma strict

var startPosition : float = 0f;
var finishPosition : float = -20f;
var scrollSpeed : float = .1f;

var delay : float = .2f;
private var currentDelay : float;

var menuController : MainMenuTransitionController;
var backMenu : GameObject;
private var inputManager : InputManager;

var titleScreen : TitleScreenAnimation;
var titleScreenTransition : float = 1f;

private var skipNext : boolean = false;

function Awake()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
}

function Update()
{
	transform.localPosition.z += scrollSpeed * Time.deltaTime;
	if( transform.localPosition.z < finishPosition )
	{
		transform.localPosition.z = finishPosition;
	}

	currentDelay -= Time.deltaTime;
	if( currentDelay <= 0f )
	{
		if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD)
		 || Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f || Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f 
		 || Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f || Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f 
		 || Input.touchCount > 0 )
		{
			GameObject.Find("GameStatus").GetComponent(GameStatus).PlayMenuSound();
			menuController.StartTransition( this.gameObject, backMenu );
		}
	}

	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) )
	{
		menuController.StartTransition( this.gameObject, backMenu );
	}
}

function ShowMenu()
{
	titleScreen.ReverseTransition(titleScreenTransition);
	transform.localPosition.z = startPosition;
}

function StartMenu()
{
	if( !skipNext )
	{
		enabled = true;
		currentDelay = delay;
		
		skipNext = true;
		this.gameObject.BroadcastMessage("StartMenu");
	}
	else
	{
		skipNext = false;
	}
}

function StopMenu()
{
	if( !skipNext )
	{
		enabled = false;
		titleScreen.StartTransition(titleScreenTransition);
		
		skipNext = true;
		this.gameObject.BroadcastMessage("StartMenu");
	}
	else
	{
		skipNext = false;
	}
}
/*
function HideMenu()
{
	titleObject.renderer.enabled = true;
}
*/