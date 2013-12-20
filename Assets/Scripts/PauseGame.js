#pragma strict

var delay : float = .5f;
private var delayTime : float;
private var prevTime : float;

var items : UIItem[];
var selectedItem : int = 0;

var selectedColor : Material;
var idleColor : Material;

private var inputManager : InputManager;
var paused : boolean;

var gameMenu : InGameMenu;

var levelSpawner : LevelSpawner;
var gameStatus : GameStatus;

var waveText : TextMesh;
var p1StatusText : TextMesh;
var p2StatusText : TextMesh;

var waveTextRenderer : MeshRenderer;
var pauseText : MeshRenderer;
var resumeText : MeshRenderer;
var restartText : MeshRenderer;
var detailsText : MeshRenderer;
var p1StatusTextRenderer : MeshRenderer;
var p2StatusTextRenderer : MeshRenderer;
var exitText : MeshRenderer;

var allowPause : boolean = true;

var skipPause : boolean = false;

function Awake()
{
	allowPause = true;
	paused = false;
	inputManager = InputManager.Instance;
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
}

function Update()
{
	delayTime -= (Time.realtimeSinceStartup - prevTime);
	prevTime = Time.realtimeSinceStartup;

	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) )
	{
		Pause(true);
		return;
	}

	// remove the input delay if all axes are released, need to hack this a little
	// because Unity doesn't report axis information with 0 timescale
#if ( UNITY_ANDROID || UNITY_IPHONE ) && !UNITY_EDITOR
	if( !inputManager.GetKey(InputManager.IB_MOVE) && Input.touchCount == 0 )
#else
	if( !Input.GetKeyDown(KeyCode.I) && !Input.GetKeyDown(KeyCode.K) 
	 && !Input.GetKeyDown(KeyCode.DownArrow) && !Input.GetKeyDown(KeyCode.UpArrow) 
	 && !Input.GetKeyDown(KeyCode.LeftArrow) && !Input.GetKeyDown(KeyCode.RightArrow) )
#endif
	{
		delayTime = -1f;
	}
	
	if( delayTime < 0f )
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		if( inputManager.GetKey(InputManager.IB_DOWN) )
#else
		if( Input.GetKeyDown(KeyCode.K) )
#endif
		{
			MoveSelection(1);
			delayTime = delay;
		}
#if UNITY_ANDROID && !UNITY_EDITOR
		else if( inputManager.GetKey(InputManager.IB_UP) )
#else
		else if( Input.GetKeyDown(KeyCode.I) )
#endif
		{
			MoveSelection(-1);
			delayTime = delay;
		}
	}

#if UNITY_ANDROID && !UNITY_EDITOR
	if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) )
#else
	if( Input.GetKeyUp(KeyCode.DownArrow) || Input.GetKeyUp(KeyCode.UpArrow) 
	 || Input.GetKeyUp(KeyCode.LeftArrow) || Input.GetKeyUp(KeyCode.RightArrow) )
#endif
	{
		AcceptSelection();
	}
}

function MoveSelection( direction : int )
{
	if( selectedItem != -1 )
	{
		SetSelection( selectedItem + direction );
	}
	else
	{
		SetSelection( (direction == 1) ? (0) : (items.Length - 1) );
	}
}

function SetSelection( index : int )
{
	if( (index >= 0) && (index < items.Length) )
	{
		if( (selectedItem != -1) && (selectedItem != index) )
		{
			items[selectedItem].SetColor(idleColor, false);
		}
		selectedItem = index;
		items[selectedItem].SetColor(selectedColor, true);
	}
}

function ClearSelection()
{
	if( selectedItem != -1 )
	{
		items[selectedItem].SetColor(idleColor, false);
		selectedItem = -1;
	}
}

function AcceptSelection()
{
	if( selectedItem != -1 )
	{
		gameStatus.PlayMenuSound();
		switch( selectedItem )
		{
			case 0:
				Pause(true);
				break;
			case 1:
				levelSpawner.RestartWave();
				Pause(true);
				break;
			case 2:
				gameStatus.startInDetails = true;
				gameStatus.detailsWave = levelSpawner.currentWave;
				Application.LoadLevel("MainMenu");
				break;
			case 3:
				delayTime = delay;
				if( levelSpawner.player1.gameObject.activeSelf )
				{
					levelSpawner.UnsetPlayer(1);
					p1StatusText.text = "P1 Join";
				}
				else
				{
					levelSpawner.p1Score.PlayerJoined();
					p1StatusText.text = "P1 Leave";
				}
				break;
			case 4:
				delayTime = delay;
				if( levelSpawner.player2.gameObject.activeSelf )
				{
					levelSpawner.UnsetPlayer(2);
					p2StatusText.text = "P2 Join";
				}
				else
				{
					levelSpawner.p2Score.PlayerJoined();
					p2StatusText.text = "P2 Leave";
				}
				break;
			case 5:
				Application.LoadLevel("MainMenu");
				break;
		}
	}
}

function DisablePause()
{
	allowPause = false;

	paused = false;
	Time.timeScale = 1f;
	HideMenu();
}

function EnablePause()
{
	allowPause = true;
}

#if ( UNITY_ANDROID || UNITY_IPHONE )
function OnApplicationPause( isPausing : boolean )
{
	if( isPausing )
	{
		Chartboost.Instance.onStop();
		if( allowPause )
		{
			Pause(false);
		}
		else
		{
			allowPause = true;
		}
	}
	else
	{
		Chartboost.Instance.onStart();
		if(paused && inputManager.isShowingAd)
		{
			Pause(true);
			inputManager.FlurryClearIsShowingAd();	
		}
	}
}

function OnApplicationFocus( focus : boolean )
{
	if( !focus )
	{
		OnApplicationPause( true );
	}
}
#endif

/*
function UpdateControllerMessages( hasP1 : boolean, hasP2 : boolean )
{
	if( (!hasP1 && !gameStatus.oneTouch) || !hasP2 )
	{
		if( !hasP1 && !gameStatus.oneTouch )
		{
			inputManager.ClearController( 1 );
		}
		if( !hasP2 )
		{
			inputManager.ClearController( 2 );
		}
		
		Pause(false);
	}

	if( paused )
	{
		p1StatusTextRenderer.enabled = (!hasP1 && !gameStatus.oneTouch);
		p2StatusTextRenderer.enabled = !hasP2;
	}
}
*/

function Pause( allowUnpause : boolean )
{
	if( !paused )
	{
		paused = true;
		Time.timeScale = 0f;
		inputManager.BroadcastMessage("SetPrevTimeScale", 0f);
		
		gameMenu.EnterMenu( gameObject );
	}
	else if( allowUnpause )
	{
		paused = false;
		Time.timeScale = 1f;
		inputManager.BroadcastMessage("SetPrevTimeScale", 1f);
		
		gameMenu.ExitMenu( gameObject );
	}
}

function ShowMenu()
{
	waveText.text = "Wave " + levelSpawner.currentWave;
	p1StatusText.text = levelSpawner.player1.gameObject.activeSelf ? "P1 Leave" : "P1 Join";
	p2StatusText.text = levelSpawner.player2.gameObject.activeSelf ? "P2 Leave" : "P2 Join";
	
	waveTextRenderer.enabled = true;
	pauseText.enabled = true;

	resumeText.enabled = true;
	restartText.enabled = true;
	detailsText.enabled = true;
	p1StatusTextRenderer.enabled = true;
	p2StatusTextRenderer.enabled = true;
	exitText.enabled = true;

	SetSelection(0);
}

function StartMenu()
{
	enabled = true;

	delayTime = delay;
	prevTime = Time.realtimeSinceStartup;
}

function StopMenu()
{
	enabled = false;
}

function HideMenu()
{
	waveTextRenderer.enabled = false;
	pauseText.enabled = false;
	resumeText.enabled = false;
	restartText.enabled = false;
	detailsText.enabled = false;
	p1StatusTextRenderer.enabled = false;
	p2StatusTextRenderer.enabled = false;
	exitText.enabled = false;
}
