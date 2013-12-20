#pragma strict

var playerText : TextMesh;
var playerTextRenderer : MeshRenderer;

var levelSpawner : LevelSpawner;
var ratingMenu : InGameRatingMenu;

var writeSpeed : float = .025f;

var myPlayer : PlayerInput;
var otherPlayer : PlayerInput;
var centerOffset : float = 4f;

private var targetText : String;
var targetLength : int;
private var currentLength : int;
private var currentTime : float;

var efficiency : float;
var lives : int;

function WaveFinished()
{
	if( myPlayer.GetWaveScore() == 0 )
	{
		playerText.text = "";
		targetText = "";
		targetLength = 0;
		playerTextRenderer.enabled = false;
		return;
	}
	
	playerTextRenderer.enabled = true;
	playerText.text = "";

	if( myPlayer.GetWaveScore() != 0 && otherPlayer.GetWaveScore() != 0 )
	{
		transform.localPosition.x = centerOffset;
	}
	else
	{
		transform.localPosition.x = 0f;
	}
	
	currentLength = 0;
	currentTime = 0f;
	
	if( myPlayer.GetShotsFired() != 0 )
	{
		efficiency = myPlayer.GetWaveScore();
		efficiency /= myPlayer.GetShotsFired();
	}
	else
	{
		efficiency = 0;
	}
	lives = myPlayer.GetRemainingLives();
	targetText = "Efficiency\n" + efficiency.ToString("#0.00") + "\n\nLives\n" + lives;
	targetLength = targetText.Length;
}

function ShowMenu()
{
	currentLength = 0;
	currentTime = 0f;

	enabled = true;
}

function HideMenu()
{
	playerTextRenderer.enabled = false;
}

function Update()
{
	currentTime += Time.deltaTime;
	
	if( currentTime > writeSpeed )
	{
		while( currentTime > writeSpeed )
		{
			currentTime -= writeSpeed;
			++currentLength;
		}
		
		if( currentLength > targetLength )
		{
			playerText.text = targetText;
			enabled = false;
			ratingMenu.ResumeMenu();
		}
		else
		{
			playerText.text = targetText.Substring(0, currentLength) + "_";
		}
	}
}
