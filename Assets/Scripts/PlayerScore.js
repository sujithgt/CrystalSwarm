#pragma strict

var display : GUIText;
//var score : int;
var waveScore : int;
var endWave : int;

var livesIndicator : LivesIndicator;
//var extraLifeScoresArray : int[] = [15000, 20000, 25000];
//var extraLifeScore : int = 25000;
//private var nextExtraLife : int;

var disconnectText : GUIText;
var disconnectTime : float;
private var disconnected : boolean = false;
private var disconnectFlashing : boolean = false;

var pauseObject : PauseGame;

var isPlayer1 : boolean = true;
var player : GameObject;

var levelSpawner : LevelSpawner;

private var inputManager : InputManager;
private var status : GameStatus;

static final var DISCONNECT_FLASH_TIME : float = 6f;
static final var DISCONNECT_IGNORE_TIME : float = 3f;
static final var DISCONNECT_TOGGLE_TIME : float = (1f / .75f);

function Start()
{
	inputManager = InputManager.Instance;
	status = GameObject.Find("GameStatus").GetComponent(GameStatus);

	waveScore = 0;

	/*
	extraLifeScore = extraLifeScoresArray[status.difficulty];
	score = 0;//(status.gameMode == GameStatus.MODE_DESCENT) ? status.GetScore( isPlayer1 ? 1 : 2 ) : 0;

	nextExtraLife = extraLifeScore;
	while( nextExtraLife < score )
	{
		nextExtraLife += extraLifeScore;
	}
	*/

	if( !status.GetPlayerJoinStatus( isPlayer1 ? 1 : 2 ) )
	{
		ShowJoin();
	}
	else
	{
		display.text = waveScore.ToString();
		enabled = false;
	}
}

function Update()
{
	if( disconnected )
	{
		if( disconnectFlashing )
		{
			disconnectTime += Time.deltaTime;
			
			if( disconnectTime > DISCONNECT_FLASH_TIME )
			{
				ShowDisconnect();
				disconnectFlashing = false;
			}
			else
			{
				UpdateConnectedDisplay();
			}
		}
	}
	else
	{
#if ( UNITY_ANDROID || UNITY_IPHONE ) && !UNITY_EDITOR
		if( inputManager.GetKeyReleased(InputManager.IB_START, isPlayer1 ? 1 : 2) )
#else
		if( Input.GetAxis(isPlayer1?"P1FireX":"P2FireX") != 0f || Input.GetAxis(isPlayer1?"P1FireX":"P2FireY") != 0f )
#endif
		{
			PlayerJoined();
			
			pauseObject.skipPause = true;
		}
	}
}

function AddPoints( points : int )
{
	if( disconnected && disconnectTime > DISCONNECT_IGNORE_TIME )
	{
		enabled = false;
		disconnected = false;
		ShowScore();
	}
	
	waveScore += points;
	display.text = waveScore.ToString();

	/*
	score += points;
	display.text = score.ToString();
	if( score >= nextExtraLife )
	{
		nextExtraLife += extraLifeScore;
		//no extra lives for now
		//livesIndicator.AddLife();
	}
	*/
}

function NextWave( targetLives : int )
{
	waveScore = 0;
	livesIndicator.NextWave( targetLives );
	
	//update score display
	if( player.activeSelf )
	{
		AddPoints(0);
	}
}

function PlayerJoined()
{
	enabled = false;
	status.PlayerJoined( isPlayer1 ? 1 : 2 );

	ShowScore();
	display.text = waveScore.ToString();

	/*
	score = 0;//(status.gameMode == GameStatus.MODE_DESCENT) ? status.GetScore( isPlayer1 ? 1 : 2 ) : 0;
	
	nextExtraLife = extraLifeScore;
	while( nextExtraLife < score )
	{
		nextExtraLife += extraLifeScore;
	}
	*/
	
	player.GetComponent(PlayerLives).SpawnPlayer();
	player.SetActive(true);
	livesIndicator.gameObject.SetActive(true);
	livesIndicator.Refresh();
}

function UpdateControllerState( connected : boolean )
{
	if( connected && disconnected )
	{
		disconnected = false;
		UpdateConnectedDisplay();
	}
	if( !connected && !disconnected )
	{
		disconnected = true;
		if( player.activeSelf )
		{
			pauseObject.Pause(false);
			disconnectFlashing = true;
			disconnectTime = 0f;
		}
		else
		{
			disconnectFlashing = false;
		}
		UpdateConnectedDisplay();
	}
	
	enabled = enabled || disconnected;
}

private function UpdateConnectedDisplay()
{
	if( disconnected )
	{
		if( disconnectFlashing )
		{
			var showFlash : int = disconnectTime * DISCONNECT_TOGGLE_TIME;
			if( showFlash % 2 == 0 )
			{
				ShowDisconnect();
			}
			else
			{
				ShowBlank();
			}
		}
		else
		{
			ShowDisconnect();
		}
	}
	else
	{
		ShowScore();
	}
}

function ShowJoin()
{
	display.text = "Start\nto join";
	enabled = true;

	livesIndicator.gameObject.SetActive(false);
	display.enabled = true;
	disconnectText.enabled = false;
}

private function ShowScore()
{
	livesIndicator.gameObject.SetActive(true);
	display.enabled = true;
	disconnectText.enabled = false;
}

private function ShowDisconnect()
{
	livesIndicator.gameObject.SetActive(false);
	display.enabled = false;
	disconnectText.enabled = true;
}

private function ShowBlank()
{
	livesIndicator.gameObject.SetActive(false);
	display.enabled = false;
	disconnectText.enabled = false;
}