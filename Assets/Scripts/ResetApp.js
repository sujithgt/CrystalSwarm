#pragma strict

private var inputManager : InputManager;

var menu : InGameMenu;
var pause : PauseGame;

function Awake()
{
	inputManager = InputManager.Instance;
}

function Update ()
{
	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) 
	 || inputManager.GetKeyReleased(InputManager.IB_START) )
	{
		// if this is true a player just joined the game, so the button press will
		// be for the join and not a pause
		if( pause.skipPause )
		{
			pause.skipPause = false;
			
			//still pick up the pause in the off chance that both players pressed pause
			//  during the same frame (1 will be for the join, the other for the pause)
			if( !( inputManager.GetKeyReleased(InputManager.IB_START,1) && inputManager.GetKeyReleased(InputManager.IB_START,2) ) )
			{
				return;
			}
		}

		if( Time.timeScale != 0f && pause.allowPause )
		{
			pause.Pause(false);
			menu.EnterMenu(pause.gameObject);
		}
	}
}

/* original update, returns to main menu on back press
function Update ()
{
	if( Input.GetKeyDown(KeyCode.Escape) || inputManager.GetKeyPressed(InputManager.IB_SELECT) )
	{
		var object : GameObject = GameObject.Find("GameStatus");
		if( object != null )
		{
			Destroy(object);
		}
		Application.LoadLevel("MainMenu");
	}
}
*/