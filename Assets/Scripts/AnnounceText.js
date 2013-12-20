#pragma strict

var displayedText : TextMesh;
var trans : Transform;

var levelSpawner : LevelSpawner;
var highScores : HighScores;

var startHeight : float = 9f;
var endHeight : float = -2f;
var time : float = 2f;
var startOnRotation : float = -.5f;
var endOnRotation : float = 1.75;

var nextStartTime : float = 2f;
private var nextWaveStarted : boolean;

private var gameOver : boolean;
private var timePassed : float;
private var linSpeed : float;
private var angSpeed : float;

function Awake()
{
	nextWaveStarted = false;
	timePassed = 0f;
	linSpeed = (endHeight - startHeight) / time;
	angSpeed = 360 / time;
}

function Update ()
{
	timePassed += Time.deltaTime;
	trans.localPosition.z += linSpeed * Time.deltaTime;
	trans.localRotation = Quaternion.Euler(90f + (angSpeed * timePassed) + (startOnRotation * 360f), -270f, -90f);

	if( timePassed >= ((endOnRotation - startOnRotation) * time) )
	{
		if( gameOver )
		{
			trans.localRotation = Quaternion.Euler(90f, -270f, -90f);
			highScores.AllowFinish();
			enabled = false;
		}
		else
		{
			if( !nextWaveStarted )
			{
				nextWaveStarted = true;
				levelSpawner.EndAnnounce();
			}
			gameObject.SetActive(false);
		}
	}
	
	if( !gameOver && !nextWaveStarted && timePassed >= nextStartTime )
	{
		nextWaveStarted = true;
		levelSpawner.EndAnnounce();
	}
}

function GameOver( wave : int )
{
	displayedText.text = "GAME OVER\nWave " + wave;
	gameOver = true;
	endOnRotation = 1f;
	highScores.Show();
}

function SetWave( wave : int )
{
	displayedText.text = "Wave " + wave;
}

function InitializePosition()
{
	nextWaveStarted = false;
	timePassed = 0f;
	trans.localPosition.z = startHeight + (linSpeed * startOnRotation);
	trans.localRotation = Quaternion.Euler(90f + (startOnRotation * 360), -270f, -90f);
}