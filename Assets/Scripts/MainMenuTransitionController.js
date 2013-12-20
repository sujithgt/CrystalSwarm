#pragma strict

private var inputManager : InputManager;

var currentMenu : GameObject;

var splashTextPrompt : MeshRenderer;
var splashTextBlink : float = 1f;

var splashScreenPieces : TitleScreenAnimation[];
var splashTransitionTime : float = 2f;
private var curSplashTime : float;
private var initializedSplash : boolean;
private var movedSplash : boolean;

var titleMenu : GameObject;
var gameMenu : GameObject;
var detailMenu : GameObject;

var saveMenu : SaveMenuController;
var playerMenu : PlayerMenuController;

var gameStatusTemplate : GameObject;

private var prevMenu : GameObject;
private var nextMenu : GameObject;

var menuParentObject : Transform;

var transitionTime : float = 1f;
var midPauseTime : float = .3f;
private var curTime : float;
private var firstShown : boolean;
private var nextShown : boolean;

private var xScaleVel : float;
private var zScaleVel : float;

var onAnimValue : float = 1f;
var offAnimValue : float = .01f;
var xMidAnimValue : float = .6f;
var zMidAnimValue : float = .1f;

function Awake()
{
	inputManager = InputManager.Instance;
	var gameStatus : GameObject = GameObject.Find("GameStatus");

	Time.timeScale = 1f;

	if( gameStatus == null )
	{
		gameStatus = Instantiate( gameStatusTemplate, Vector3.zero, Quaternion.identity );
		gameStatus.name = "GameStatus";
		gameStatus.SetActive(true);
		initializedSplash = false;
		currentMenu = titleMenu;
	}
	else
	{
		var status : GameStatus = gameStatus.GetComponent(GameStatus);
		if( status.startInDetails )
		{
			saveMenu.PrepareDetailSlot(status.saveSlot);
			currentMenu = detailMenu;
		}
		else
		{
			currentMenu = titleMenu;
		}
		status.Reinitialize();

		initializedSplash = true;
	}

	if( !initializedSplash )
	{
		movedSplash = false;
		enabled = true;
	}
	else
	{
		for( var i : int = 0 ; i < splashScreenPieces.Length ; ++i )
		{
			splashScreenPieces[i].FinishTransition();
		}
		movedSplash = true;
		currentMenu.BroadcastMessage("ShowMenu", false, SendMessageOptions.DontRequireReceiver);
		currentMenu.SendMessage("StartMenu", false, SendMessageOptions.DontRequireReceiver);
		enabled = false;
	}
}

function Update()
{
	if( initializedSplash )
	{
		curTime += Time.deltaTime;
		
		if( curTime < (.5f * transitionTime) )
		{
			if( prevMenu == null )
			{
				curTime = .5f * transitionTime;
				menuParentObject.localScale.x = offAnimValue;
				menuParentObject.localScale.z = offAnimValue;
			}
			else
			{
				if( curTime < (.17f * transitionTime) )
				{
					menuParentObject.localScale.x = onAnimValue - ((onAnimValue - xMidAnimValue) * (curTime / (.17f * transitionTime)));
					menuParentObject.localScale.z = onAnimValue - ((onAnimValue - zMidAnimValue) * (curTime / (.17f * transitionTime)));
				}
				else
				{
					menuParentObject.localScale.x = xMidAnimValue - ((xMidAnimValue - offAnimValue) * ((curTime - (.17f * transitionTime)) / (.33f * transitionTime)));
					menuParentObject.localScale.z = zMidAnimValue - ((zMidAnimValue - offAnimValue) * ((curTime - (.17f * transitionTime)) / (.33f * transitionTime)));
				}
			}
		}
		else if( firstShown )
		{
			firstShown = false;
			if( prevMenu != null )
			{
				prevMenu.BroadcastMessage("HideMenu", false, SendMessageOptions.DontRequireReceiver);
			}
		}
		
		if( curTime > ((.5f * transitionTime) + midPauseTime) )
		{
			if( !nextShown )
			{
				nextShown = true;
				nextMenu.BroadcastMessage("ShowMenu", false, SendMessageOptions.DontRequireReceiver);
			}
			if( curTime < ((.83f * transitionTime) + midPauseTime) )
			{
				menuParentObject.localScale.x = offAnimValue + ((xMidAnimValue - offAnimValue) * (((curTime - midPauseTime) - (.5f * transitionTime)) / (.33f * transitionTime)));
				menuParentObject.localScale.z = offAnimValue + ((zMidAnimValue - offAnimValue) * (((curTime - midPauseTime) - (.5f * transitionTime)) / (.33f * transitionTime)));
			}
			else
			{
				menuParentObject.localScale.x = xMidAnimValue + ((onAnimValue - xMidAnimValue) * (((curTime - midPauseTime) - (.83f * transitionTime)) / (.17f * transitionTime)));
				menuParentObject.localScale.z = zMidAnimValue + ((onAnimValue - zMidAnimValue) * (((curTime - midPauseTime) - (.83f * transitionTime)) / (.17f * transitionTime)));
			}
		}
		
		if( curTime >= (transitionTime + midPauseTime) )
		{
			menuParentObject.localScale.x = onAnimValue;
			menuParentObject.localScale.z = onAnimValue;
			nextMenu.SendMessage("StartMenu", false, SendMessageOptions.DontRequireReceiver);
			currentMenu = nextMenu;
			enabled = false;
		}
	}
	else
	{
		if( !movedSplash )
		{
			curSplashTime += Time.deltaTime;
			if( curSplashTime >= splashTextBlink )
			{
				curSplashTime -= splashTextBlink;
				splashTextPrompt.enabled = !splashTextPrompt.enabled;
			}
			
			if( (Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f) 
			 || (Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f)
			 || inputManager.GetKeyReleased(InputManager.IB_FIRE) || inputManager.GetKeyReleased(InputManager.IB_START)
			 || Input.touchCount > 0 )
			{
				GameObject.Find("GameStatus").GetComponent(GameStatus).PlayMenuSound();
			
				splashTextPrompt.enabled = false;
				curSplashTime = 0f;
				movedSplash = true;
				for( var i : int = 0 ; i < splashScreenPieces.Length ; ++i )
				{
					splashScreenPieces[i].StartTransition( splashTransitionTime );
				}
				
				if( inputManager.GetKeyReleased(InputManager.IB_FIRE,1) || inputManager.GetKeyReleased(InputManager.IB_START,1) )
				{
					playerMenu.PlayerJoined(1);
				}
				if( inputManager.GetKeyReleased(InputManager.IB_FIRE,2) || inputManager.GetKeyReleased(InputManager.IB_START,2) )
				{
					playerMenu.PlayerJoined(2);
				}
			}
		 }
		 else
		 {
		 	curSplashTime += Time.deltaTime;
		 	if( curSplashTime > splashTransitionTime )
		 	{
		 		initializedSplash = true;
		 		StartTransition( null, currentMenu );
		 	}
		 }

		if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) )
		{
			Application.Quit();
		}
	}
}

function StartTitleMenu()
{
	StartTransition(currentMenu, titleMenu);
}

function StartTransition( prev : GameObject, next : GameObject )
{
	prevMenu = prev;
	nextMenu = next;
	
	curTime = 0f;
	firstShown = true;
	nextShown = false;
	
	if( prevMenu != null )
	{
		prevMenu.BroadcastMessage("StopMenu", false, SendMessageOptions.DontRequireReceiver);
	}
	
	enabled = true;
}

//handle the back button from the touch prompt
function AcceptSelection()
{
	if( currentMenu != null )
	{
		currentMenu.SendMessage("BackPressed", null, SendMessageOptions.DontRequireReceiver);
	}
}

//dont error on the other messages potentially passed from touch controls from the
// back button, but not need to respond to them either
function ScrollMenu( dir : int )
{

}

function SetSelection( index : int )
{

}

function ClearSelection()
{

}

function ScrollSelection( dir : int )
{

}
