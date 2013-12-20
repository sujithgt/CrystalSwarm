#pragma strict

private var p1joined : boolean = false;
private var p2joined : boolean = false;

private var p1ControllerDetected : boolean = false;
private var p2ControllerDetected : boolean = false;

var menuMusic : AudioSource;

var song1 : AudioSource;
//var song2 : AudioSource;
//var song1Playing : boolean;
var songVolumes : float[];

var uiSound : AudioSource;
var uiSoundVolume : float;

var gameMode : int;
var difficulty : int;
var startWave : int = 1;
var defaultWave : int = 1;

var oneTouch : boolean = true;

private var inputManager : InputManager;
//private var debugInfo : DebugDisplay;

var saveSlot : int;
var wave : int;

var startOnWave : int;

var startInDetails : boolean = false;
var detailsWave : int = -1;

var ratingTotal : int;
var waveRating : char[];

private var p1ScoreComponent : PlayerScore;
private var p2ScoreComponent : PlayerScore;
private var p1LivesComponent : LivesIndicator;
private var p2LivesComponent : LivesIndicator;
private var levelSpawner : LevelSpawner;

static final var MODE_DESCENT = 0;
static final var MODE_SURVIVAL = 1;
static final var MODE_BOSS = 2;
static final var MODE_TEST = 3;

function Awake()
{
	DontDestroyOnLoad(this.gameObject);
	
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
	//debugInfo = GameObject.Find("GreenThrottleSingleton").GetComponent(DebugDisplay);
	
	Time.timeScale = 1f;
	
	Globals.LoadSettings();
	
	menuMusic.volume = songVolumes[0] * Globals.GetMusicVolume();
	menuMusic.Play();
	
	enabled = false;
}

/*
function Update()
{
	if( debugInfo.inDebugMode )
	{
		if( inputManager.GetKeyPressed(InputManager.IB_L2) || Input.GetKeyDown(KeyCode.Alpha9) )
		{
			if( song1Playing )
			{
				song1.Stop();
				song2.volume = songVolumes[1] * Globals.GetMusicVolume();
				song2.Play();
				song1Playing = false;
			}
			else
			{
				song2.Stop();
				song1.volume = songVolumes[0] * Globals.GetMusicVolume();
				song1.Play();
				song1Playing = true;
			}
		}
	}
}
*/

function GameStart()
{
//	enabled = true;
	menuMusic.Stop();
	song1.volume = songVolumes[0] * Globals.GetMusicVolume();
	song1.Play();
}

function LoadSave( slot : SaveSlot )
{
	gameMode = MODE_DESCENT;
	difficulty = slot.difficulty;
	wave = slot.wave;
	startWave = slot.wave;
	saveSlot = slot.slot;
	
	//p1joined = true;
	//p2joined = slot.players > 1;
	
	startOnWave = -1;
	
	if( slot.ratings.Length < Globals.MAX_WAVES )
	{
		slot.ratings.PadRight(Globals.MAX_WAVES - slot.ratings.Length, "0"[0]);
	}
	waveRating = slot.ratings.ToCharArray(0, Globals.MAX_WAVES);
	ratingTotal = slot.ratingTotal;
}

function SetStartingWave( wv : int )
{
	startOnWave = wv;
}

function SaveGame()
{
	//PlayerPrefs.SetInt("SavePlayers" + saveSlot, (levelSpawner.player2.gameObject.active ? 2 : 1));
	//PlayerPrefs.SetInt("SaveScore1" + saveSlot, p1score);
	//PlayerPrefs.SetInt("SaveLives1" + saveSlot, p1lives);
	//PlayerPrefs.SetInt("SaveScore2" + saveSlot, p2score);
	//PlayerPrefs.SetInt("SaveLives2" + saveSlot, p2lives);
	PlayerPrefs.SetInt("SaveWave" + saveSlot, wave);
	PlayerPrefs.SetString("SaveRatings" + saveSlot, String(waveRating));
	PlayerPrefs.SetInt("SaveRatingTotal" + saveSlot, ratingTotal);
	PlayerPrefs.Save();
}

function UpdateSaveData( wv : int, rating : int )
{
	/* lives and score removed for now
	var obj : GameObject;
	obj = GameObject.Find("Player1ScoreText");
	p1ScoreComponent = (obj == null) ? null : obj.GetComponent(PlayerScore);
	obj = GameObject.Find("Player2ScoreText");
	p2ScoreComponent = (obj == null) ? null : obj.GetComponent(PlayerScore);
	obj = GameObject.Find("P1LivesIndicator");
	p1LivesComponent = (obj == null) ? null : obj.GetComponent(LivesIndicator);
	obj = GameObject.Find("P2LivesIndicator");
	p2LivesComponent = (obj == null) ? null : obj.GetComponent(LivesIndicator);
	*/
	
	if( int.Parse(waveRating[wv-1].ToString()) < rating )
	{
		ratingTotal += rating - int.Parse(waveRating[wv-1].ToString());
		waveRating[wv-1] = rating.ToString()[0];
	}
	
	if( wv >= wave )
	{
		wave = wv + 1;
	}
	
	//p1lives = (p1LivesComponent == null || levelSpawner.player1 == null) ? 0 : p1LivesComponent.lives + 1;
	//p1score = (p1ScoreComponent == null) ? p1score : p1ScoreComponent.score;
	//p2lives = (p2LivesComponent == null || levelSpawner.player2 == null) ? 0 : p2LivesComponent.lives + 1;
	//p2score = (p2ScoreComponent == null) ? p2score : p2ScoreComponent.score;
}

function WaveFinished( wv : int, rating : int ) : boolean
{
	if( gameMode == MODE_DESCENT )
	{
		levelSpawner = GameObject.Find("LevelSpawner").GetComponent(LevelSpawner);
		inputManager.LogFlurryEvent("wave_complete", ["wave", wv.ToString(), "crystals", rating.ToString(), "crystal_total", ratingTotal.ToString(), "wave_max", wave.ToString(), "difficulty", difficulty.ToString(), "players", levelSpawner.GetPlayerCount().ToString(), "reset", "false"], false );

		UpdateSaveData( wv, rating );

		// no need for autosaves with ratings, just save after each wave regardless
		//if( (wv % autosave) == 0 )
		//{
			SaveGame();
		//}
		
		return (wv >= Globals.MAX_WAVES) || (ratingTotal >= Globals.TIER_REQUIREMENT[difficulty][wv / Globals.TIER_SIZE]);
	}
	
	return true;
}

function WaveReset( wv : int, rating : int )
{
	if( gameMode == MODE_DESCENT )
	{
		levelSpawner = GameObject.Find("LevelSpawner").GetComponent(LevelSpawner);
		inputManager.LogFlurryEvent("wave_complete", ["wave", wv.ToString(), "crystals", rating.ToString(), "crystal_total", ratingTotal.ToString(), "wave_max", wave.ToString(), "difficulty", difficulty.ToString(), "players", levelSpawner.GetPlayerCount().ToString(), "reset", "true"], false );
	}
}

function UpdateMusicVolume()
{
	menuMusic.volume = songVolumes[0] * Globals.GetMusicVolume();
	//if( song1Playing )
	//{
		song1.volume = songVolumes[0] * Globals.GetMusicVolume();
	//}
	//else
	//{
	//	song2.volume = songVolumes[1] * Globals.GetMusicVolume();
	//}
}

function PlayMenuSound()
{
	uiSound.volume = uiSoundVolume * Globals.GetSoundVolume();
	uiSound.Play();
}

function SetSurvival( diff : int )
{
	gameMode = MODE_SURVIVAL;
	difficulty = diff;
}

function SetDescent( diff : int )
{
	gameMode = MODE_DESCENT;
	difficulty = diff;
}

function SetBoss( diff : int )
{
	gameMode = MODE_BOSS;
	difficulty = diff;
}

function SetDisplayTest( diff : int )
{
	gameMode = MODE_TEST;
	difficulty = diff;
}

function SetOneTouch()
{
Debug.Log("SetOneTouch");
	oneTouch = true;
}

function DisableOneTouch()
{
Debug.Log("DisableOneTouch");
	oneTouch = false;
}

function Reinitialize()
{
	startOnWave = -1;
	startInDetails = false;
	detailsWave = -1;
}

function PlayerJoined( num : int )
{
	if( num == 1 )
	{
		p1joined = true;
	}
	else if( num == 2 )
	{
		p2joined = true;
	}
}

function PlayerLeft( num : int )
{
	if( num == 1 )
	{
		p1joined = false;
	}
	else if( num == 2 )
	{
		p2joined = false;
	}
}

function GetPlayerJoinStatus( num : int ) : boolean
{
	if( num == 1 )
	{
		return p1joined;
	}
	else if( num == 2 )
	{
		return p2joined;
	}
	return false;
}

function GetPlayerControllerStatus( num : int ) : boolean
{
	if( num == 1 )
	{
		return p1ControllerDetected;
	}
	else if( num == 2 )
	{
		return p2ControllerDetected;
	}
	return false;
}

function UpdatePlayers( p1 : boolean, p2 : boolean )
{
	p1joined = p1 || (!p1 && !p2);
	p2joined = p2;
}

function UpdateControllers( p1 : boolean, p2 : boolean )
{
	p1ControllerDetected = p1 || p1ControllerDetected;
	p2ControllerDetected = p2 || p2ControllerDetected;
}