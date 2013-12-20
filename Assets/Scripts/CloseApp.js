#pragma strict

private var inputManager : InputManager;

function Start()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
}

function Update ()
{
	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) )
	{
		Application.Quit();
	}
}