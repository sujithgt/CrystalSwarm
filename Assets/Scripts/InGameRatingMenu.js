#pragma strict

var sharedText : TextMesh;
var sharedTextRenderer : MeshRenderer;
var p1RatingText : PlayerRatingText;
var p2RatingText : PlayerRatingText;
var resumeCount : int;

var levelSpawner : LevelSpawner;
var menu : InGameMenu;

var pauseMenu : PauseGame;

var curWave : int;
var waveText : TextMesh;
var waveTextRenderer : MeshRenderer;

var writeSpeed : float = .025f;
var crystalSpeed : float = 1f;
var endDelay : float = 3f;

var currentCrystal : int;
var crystal1 : GameObject;
var crystal1Anim : AnimationControl;
var crystal2 : GameObject;
var crystal2Anim : AnimationControl;
var crystal3 : GameObject;
var crystal3Anim : AnimationControl;

var targetRating : float;

private var targetText : String;
private var targetLength : int;
private var currentLength : int;
private var currentTime : float;

var finishedWrite : boolean;
var showingCrystals : boolean;

var rating : float;
var crystalsEarned : int;

function WaveFinished( wave : int )
{
	pauseMenu.DisablePause();

	curWave = wave;

	menu.EnterMenu(gameObject);

	waveText.text = "Wave " + curWave;
	waveTextRenderer.enabled = true;
	
	resumeCount = 0;
	
	sharedText.text = "";
	p1RatingText.WaveFinished();
	p2RatingText.WaveFinished();
}

function ShowMenu()
{
	var discreteTime : int;
	
	sharedTextRenderer.enabled = true;
	
	discreteTime = levelSpawner.waveTime / 60;
	targetText = "Time\n" + discreteTime + ":";
	discreteTime = levelSpawner.waveTime - (60 * discreteTime);
	targetText += discreteTime.ToString("00") + "\n";
	
	targetLength = targetText.Length;
	currentLength = 0;
	currentTime = 0f;

	enabled = true;
	finishedWrite = false;
	showingCrystals = false;
}

function HideMenu()
{
	waveTextRenderer.enabled = false;
	
	sharedTextRenderer.enabled = false;
	p1RatingText.HideMenu();
	p2RatingText.HideMenu();
	
	crystal1.SetActive(false);
	crystal2.SetActive(false);
	crystal3.SetActive(false);
	
	pauseMenu.EnablePause();
}

function ResumeMenu()
{
	++resumeCount;
	if( resumeCount < 2 )
	{
		return;
	}
	
	rating = 0f;
	crystalsEarned = 0;
	
	if( p1RatingText.targetLength > 0 )
	{
		rating += p1RatingText.lives * p1RatingText.efficiency;
	}
	if( p2RatingText.targetLength > 0 )
	{
		rating += p2RatingText.lives * p2RatingText.efficiency;

		if( p1RatingText.targetLength > 0 )
		{
			rating *= .5f;
		}
	}
	
	rating += levelSpawner.GetTimeRating();
	
	if( rating < 0f )
	{
		rating = 0f;
	}
	
	//should always get a rating of 200 from an ideal time
	targetRating = Globals.RATING_TIME_BASE + (2f * levelSpawner.GetTargetEfficiency( curWave ));

	targetText += "\n\n\n\n\n\n";
	currentLength += 6;
	targetText += "\nRating\n" + rating.ToString("#0.0");
	targetLength = targetText.Length;


	enabled = true;
}

function Update()
{
	currentTime += Time.deltaTime;
	
	if( !showingCrystals )
	{
		if( currentTime > writeSpeed )
		{
			while( currentTime > writeSpeed )
			{
				currentTime -= writeSpeed;
				++currentLength;
			}
			
			if( currentLength > targetLength )
			{
				sharedText.text = targetText;
				if( !finishedWrite )
				{
					p1RatingText.ShowMenu();
					p2RatingText.ShowMenu();
					finishedWrite = true;
					enabled = false;
				}
				else
				{
					showingCrystals = true;
					crystal1.SetActive(true);
					crystal2.SetActive(true);
					crystal3.SetActive(true);
					currentCrystal = 0;
					currentTime = 0f;
				}
			}
			else
			{
				sharedText.text = targetText.Substring(0, currentLength) + "_";
			}
		}
	}
	else
	{
		if( currentTime >= (crystalSpeed * 1f) && currentCrystal < 1 )
		{
			++currentCrystal;
			if( rating >= (targetRating + Globals.RATING_1_OFFSET) )
			{
				crystal1Anim.StartAnimation("shimmer");
				crystalsEarned = 1;
			}
		}

		if( currentTime >= (crystalSpeed * 2f) && currentCrystal < 2 )
		{
			++currentCrystal;
			if( rating >= (targetRating + Globals.RATING_2_OFFSET) )
			{
				crystal2Anim.StartAnimation("shimmer");
				crystalsEarned = 2;
			}
		}

		if( currentTime >= (crystalSpeed * 3f) && currentCrystal < 3 )
		{
			++currentCrystal;
			if( rating >= (targetRating + Globals.RATING_3_OFFSET) )
			{
				crystal3Anim.StartAnimation("shimmer");
				crystalsEarned = 3;
			}
		}
		
		if( currentTime >= ((crystalSpeed * 3f) + endDelay) )
		{
			enabled = false;
			menu.ExitMenu(gameObject);
			levelSpawner.EndRatingDisplay(crystalsEarned);
		}
	}
}
