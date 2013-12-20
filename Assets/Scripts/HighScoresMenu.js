#pragma strict

var delay : float = .2f;
private var delayTime : float;

var menuController : MainMenuTransitionController;
var backMenu : GameObject;
var backLabel : ButtonLabel;

private var inputManager : InputManager;

function Awake()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
}

function ShowMenu()
{
	backLabel.Show();
}

function StartMenu()
{
	enabled = true;
	delayTime = delay;
}

function StopMenu()
{
	enabled = false;
}

function HideMenu()
{
	backLabel.Hide();
}

function Update()
{
	delayTime -= Time.deltaTime;

	if( delayTime <= 0f )
	{
		if( inputManager.GetKey(InputManager.IB_MENUFORWARD) 
		 || Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f || Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f 
		 || Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f || Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f )
		{
			menuController.StartTransition( this.gameObject, backMenu );
		}
	}
	
	if( Input.GetKeyDown(KeyCode.Escape) || inputManager.GetKeyPressed(InputManager.IB_SELECT) || inputManager.GetKeyPressed(InputManager.IB_MENUBACKWARD) )
	{
		menuController.StartTransition( this.gameObject, backMenu );
	}
}
