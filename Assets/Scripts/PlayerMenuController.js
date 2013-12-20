#pragma strict

var p1Text : GUIText;
var p2Text : GUIText;

var p1Detected : boolean;
var p2Detected : boolean;

var p1Joined : boolean;
var p2Joined : boolean;

var p1Flashing : boolean;
var p1Changed : float;
var p2Flashing : boolean;
var p2Changed : float;
private var toggle : int;

var purchasePrompt : GameObject;

static final var STATUS_CHANGE_FLASH_INCREMENT : float = 1f / .5f;
static final var STATUS_CHANGE_FLASH_TIME : float = 3f;

private var inputManager : InputManager;

function Awake()
{
	inputManager = InputManager.Instance;

	p1Joined = false;
	p2Joined = false;
	
	p1Detected = false;
	p2Detected = false;
	
	if( GameObject.Find("GameStatus") )
	{
		var status : GameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
		p1Joined = status.GetPlayerJoinStatus( 1 );
		p2Joined = status.GetPlayerJoinStatus( 2 );
		p1Detected = status.GetPlayerControllerStatus( 1 );
		p2Detected = status.GetPlayerControllerStatus( 2 );
	}
	
	if( p1Detected || p2Detected )
	{
		HidePurchaseMenu();
	}
	
	UpdateText();
	
#if UNITY_IPHONE
	p1Text.enabled = false;
	p2Text.enabled = false;
#endif
	
	p1Flashing = false;
	p2Flashing = false;
	p1Changed = STATUS_CHANGE_FLASH_TIME;
	p2Changed = STATUS_CHANGE_FLASH_TIME;
}

function Update()
{
	if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD, 1) )
	{
		p1Detected = true;
		HidePurchaseMenu();
		if( !p1Joined )
		{
			p1Flashing = true;
			p1Changed = 0f;
			p1Joined = true;
			UpdateText();
			if( inputManager.GetKeyReleased(InputManager.IB_START, 1) )
			{
				inputManager.ClearController(1);
			}
		}
	}
	if( inputManager.GetKeyReleased(InputManager.IB_SELECT, 1) )
	{
		p1Detected = true;
		HidePurchaseMenu();
		if( p1Joined )
		{
			p1Flashing = true;
			p1Changed = 0f;
			p1Joined = false;
			UpdateText();
			inputManager.ClearController(1);
		}
	}
	
	if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD, 2) )
	{
		p2Detected = true;
		HidePurchaseMenu();
		if( !p2Joined )
		{
			p2Flashing = true;
			p2Changed = 0f;
			p2Joined = true;
			UpdateText();
			if( inputManager.GetKeyReleased(InputManager.IB_START, 2) )
			{
				inputManager.ClearController(2);
			}
		}
	}
	if( inputManager.GetKeyReleased(InputManager.IB_SELECT, 2) )
	{
		p2Detected = true;
		HidePurchaseMenu();
		if( p2Joined )
		{
			p2Flashing = true;
			p2Changed = 0f;
			p2Joined = false;
			UpdateText();
			inputManager.ClearController(2);
		}
	}
	
	if( p1Flashing )
	{
		p1Changed += Time.deltaTime;
		if( p1Changed < STATUS_CHANGE_FLASH_TIME )
		{
			toggle = (p1Changed * STATUS_CHANGE_FLASH_INCREMENT);
#if !UNITY_IPHONE
			p1Text.enabled = ((toggle % 2) == 1);
#endif
		}
		else
		{
#if !UNITY_IPHONE
			p1Text.enabled = true;
#endif
			p1Flashing = false;
		}
	}
	if( p2Flashing )
	{
		p2Changed += Time.deltaTime;
		if( p2Changed < STATUS_CHANGE_FLASH_TIME )
		{
			toggle = (p2Changed * STATUS_CHANGE_FLASH_INCREMENT);
#if !UNITY_IPHONE
			p2Text.enabled = ((toggle % 2) == 1);
#endif
		}
		else
		{
#if !UNITY_IPHONE
			p2Text.enabled = true;
#endif
			p2Flashing = false;
		}
	}
}

function SendJoinStatus( status : GameStatus )
{
	status.UpdatePlayers(p1Joined, p2Joined);
	status.UpdateControllers(p1Detected, p2Detected);
}

function ReportGameStart( status : GameStatus, fromDetails : boolean )
{
	var startWave : int = (status.startOnWave >= 0) ? status.startOnWave : status.startWave;
	
	inputManager.LogFlurryEvent("game_start", ["controllers", ControllerCount().ToString(), "players", PlayerCount().ToString(), "wave", startWave.ToString(), "crystal_total", status.ratingTotal.ToString(), "difficulty", status.difficulty.ToString(), "from_details", (fromDetails ? "true" : "false"), "one_touch", (status.oneTouch ? "true" : "false")], false );
}

function PlayerJoined( player : int )
{
	HidePurchaseMenu();

	if( player == 1 && !p1Joined )
	{
		p1Joined = true;
		p1Detected = true;
		UpdateText();
	}
	
	if( player == 2 && !p2Joined )
	{
		p2Joined = true;
		p2Detected = true;
		UpdateText();
	}
}

function PlayerLeft( player : int )
{
	if( player == 1 && p1Joined )
	{
		p1Joined = false;
		UpdateText();
	}
	
	if( player == 2 && p2Joined )
	{
		p2Joined = false;
		UpdateText();
	}
}

function PlayerCount() : int
{
	return (p1Joined ? 1 : 0) + (p2Joined ? 1 : 0);
}

function ControllerCount() : int
{
	return (p1Detected ? 1 : 0) + (p2Detected ? 1 : 0);
}

function HandleControllerEvent( event : String )
{
	//just force leave on disconnect events
	if( event == "1XD" )
	{
		p1Joined = false;
		UpdateText();
	}
	if( event == "2XD" )
	{
		p2Joined = false;
		UpdateText();
	}
}

private function UpdateText()
{
	p1Text.text = (p1Joined) ? "Back\nto leave" : "Start\nto join";
	p2Text.text = (p2Joined) ? "Back\nto leave" : "Start\nto join";
}

private function HidePurchaseMenu()
{
	purchasePrompt.BroadcastMessage("HideMenu");
	purchasePrompt.BroadcastMessage("StopMenu");
}
