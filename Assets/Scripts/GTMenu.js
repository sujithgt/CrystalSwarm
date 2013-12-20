#pragma strict

var delay : float = .5f;
private var delayTime : float;
private var prevTime : float;

var inputManager : InputManager;
var menuTransition : InGameMenu;

private var prevTimeScale : float;
private var inMenu : boolean;
private var menuActive : boolean;

private var continueSelected : boolean;
var arenaItem : MeshRenderer;
var continueItem : MeshRenderer;

var selectedColor : Material;
var idleColor : Material;

function Start()
{
	inMenu = false;
	menuActive = false;
}

function ShowMenu()
{
	menuActive = true;
	delayTime = delay;
	prevTime = Time.realtimeSinceStartup;

	arenaItem.material = idleColor;
	continueItem.material = selectedColor;
	continueSelected = true;
}

function StopMenu()
{
	inMenu = false;
	Time.timeScale = prevTimeScale;
	inputManager.ClearController();
}

function HideMenu()
{
	menuActive = false;
}

function Update()
{
	if( !inMenu )
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		if( inputManager.GetKeyReleased(InputManager.IB_GREENTHROTTLE) )
#else
		if( Input.GetKeyUp(KeyCode.Backspace) )
#endif
		{
			prevTimeScale = Time.timeScale;
			Time.timeScale = 0f;
			inMenu = true;
			menuActive = false;
			menuTransition.EnterMenu( this.gameObject );
		}
	}
	else
	{
		if( menuActive )
		{
			delayTime -= (Time.realtimeSinceStartup - prevTime);
			prevTime = Time.realtimeSinceStartup;
			
			//remove the input delay if all axes are released
#if UNITY_ANDROID && !UNITY_EDITOR
			if( !inputManager.GetKey(InputManager.IB_MOVE) && !inputManager.GetKey(InputManager.IB_MENUFORWARD) )
#else
			if( (Mathf.Abs(Input.GetAxis("P1X")) < .2f) && (Mathf.Abs(Input.GetAxis("P2X")) < .2f) 
			 && (Mathf.Abs(Input.GetAxis("P1FireX")) < .2f) && (Mathf.Abs(Input.GetAxis("P1FireY")) < .2f) 
			 && (Mathf.Abs(Input.GetAxis("P2FireX")) < .2f) && (Mathf.Abs(Input.GetAxis("P2FireY")) < .2f) )
#endif
			{
				delayTime = -1f;
			}
			
			if( delayTime <= 0f )
			{
#if UNITY_ANDROID && !UNITY_EDITOR
				if( inputManager.GetKey(InputManager.IB_LEFT) )
#else
				if( (Input.GetAxisRaw("P1X") >= .2f) || (Input.GetAxisRaw("P2X") >= .2f) )
#endif
				{
					arenaItem.material = selectedColor;
					continueItem.material = idleColor;
					continueSelected = false;
					delayTime = delay;
				}
#if UNITY_ANDROID && !UNITY_EDITOR
				else if( inputManager.GetKey(InputManager.IB_RIGHT) )
#else
				else if( (Input.GetAxisRaw("P1X") <= -.2f) || (Input.GetAxisRaw("P2X") <= -.2f) )
#endif
				{
					arenaItem.material = idleColor;
					continueItem.material = selectedColor;
					continueSelected = true;
					delayTime = delay;
				}

#if UNITY_ANDROID && !UNITY_EDITOR
				if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) )
#else
				if( (Mathf.Abs(Input.GetAxisRaw("P1FireX")) >= .2f) || (Mathf.Abs(Input.GetAxisRaw("P1FireY")) >= .2f) 
				 || (Mathf.Abs(Input.GetAxisRaw("P2FireX")) >= .2f) || (Mathf.Abs(Input.GetAxisRaw("P2FireY")) >= .2f) )
#endif
				{
					if( continueSelected )
					{
						menuTransition.ExitMenu( this.gameObject );
					}
					else
					{
						Application.Quit();
					}
				}
				
#if UNITY_ANDROID && !UNITY_EDITOR
				if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) )
#else
				if( Input.GetKeyUp(KeyCode.Escape) )
#endif
				{
					menuTransition.ExitMenu( this.gameObject );
				}
			}
		}
	}
	
#if UNITY_ANDROID && !UNITY_EDITOR
	// clear controller input if in the menu so that you cannot pause/manipulate menus
	// while the home menu is up (this is set earlier in execution order so that button
	// state should be cleared for all other scripts)
	if( inMenu )
	{
		inputManager.ClearControllerPartial();
	}
#endif
}

function SetPrevTimeScale( prev : float )
{
	prevTimeScale = prev;
}