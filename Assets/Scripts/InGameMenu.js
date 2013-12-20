#pragma strict

var menuTrans : Transform;
var textTrans : Transform;

private var prevTime : float;
private var curTime : float = 0;
private var increment : float = 1f;

var enterTime : float = .25f;
var textInTime : float = .5f;

var menuExitPos = 20f;
var menuEnterPos = 0f;

var currentTextMenu : GameObject;
private var menuUpdated : boolean;

function EnterMenu( obj : GameObject )
{
	if( enabled )
	{
		currentTextMenu.SendMessage("HideMenu");
	}
	
	prevTime = Time.realtimeSinceStartup;
	currentTextMenu = obj;
	menuUpdated = false;

	increment = 1f;

	if( curTime <= 0f )
	{
		textTrans.localScale.x = 0f;
		textTrans.localScale.z = 0f;
		
		menuTrans.localPosition.z = menuExitPos;
	}
	
	enabled = true;
}

function ExitMenu( obj : GameObject )
{
	currentTextMenu.SendMessage("StopMenu", SendMessageOptions.DontRequireReceiver);

	prevTime = Time.realtimeSinceStartup;
	if( currentTextMenu != obj )
	{
		Debug.LogError("Mismatched enter and exit on game menu");
		currentTextMenu.SendMessage("HideMenu");
	}
	currentTextMenu = obj;
	menuUpdated = false;

	if( curTime > 0f )
	{
		enabled = true;
		increment = -1f;
	}
}

function Update()
{
	var x : float;	//generic variable to store intermediate data on transitions

	curTime += (Time.realtimeSinceStartup - prevTime) * increment;
	prevTime = Time.realtimeSinceStartup;
	
	if( curTime < enterTime )
	{
		menuTrans.localPosition.z = menuEnterPos + ((menuExitPos - menuEnterPos) * (1f - (curTime / enterTime)));
	}
	else
	{
		menuTrans.localPosition.z = menuEnterPos;
		if( !menuUpdated && increment > 0 )
		{
			menuUpdated = true;
			currentTextMenu.SendMessage("ShowMenu");
		}
	}
	
	if( curTime < enterTime )
	{
		textTrans.localScale.x = 0f;
		textTrans.localScale.z = 0f;
		if( !menuUpdated && increment < 0 )
		{
			menuUpdated = true;
			currentTextMenu.SendMessage("HideMenu");
		}
	}
	else if( curTime < textInTime )
	{
		x = (curTime - enterTime) / (textInTime - enterTime);
		textTrans.localScale.x = Mathf.Min(1f, 2f * x);
		textTrans.localScale.z = x * x;
	}
	else
	{
		textTrans.localScale.x = 1f;
		textTrans.localScale.z = 1f;
	}
	
	if( curTime > textInTime )
	{
		menuTrans.localPosition.z = menuEnterPos;
		curTime = textInTime;
		enabled = false;
		currentTextMenu.SendMessage("StartMenu", SendMessageOptions.DontRequireReceiver);
	}
	
	if( curTime < 0f )
	{
		menuTrans.localPosition.z = menuExitPos;
		curTime = 0f;
		enabled = false;
	}
}