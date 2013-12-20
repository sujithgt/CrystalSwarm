#pragma strict

private var increaseModifiers : float[] = [1.7f, 1.35f, 1.1f];
private var decreaseModifiers : float[] = [.5f, .76f, 1.01f];

var difficulty : int;
var difficultyIncreaseModifier : float;
var difficultyDecreaseModifier : float;

var respawnTime : float = 5f;

var speedTime : float = 4f;
var speedIncrement : float = .35f;
var updateIncrement : float = .05f;

var currentSpeed : float;
var currentTime : float;
var currentUpdate : float;

var waveTime : float = 0f;

var player1 : Transform;
var player2 : Transform;
var spawnDistanceFromPlayer : float = 8f;
private var playerDownTimer : float = 0f;

var gameMenu : InGameMenu;
var pauseMenu : PauseGame;
var tierLimitMenu : GameObject;

var highScore : HighScores;
var p1Score : PlayerScore;
var p2Score : PlayerScore;

var powerupCenterOffset : float = -2f;

enum WAVESTATE { START_ANNOUNCE, END_ANNOUNCE, RUNNING, RESPAWNING, FINISHED, GAMEOVER, CUTSCENE }

var background : BackgroundController;
var levelDefinition : LevelDefinition;
var currentWave : int;
var waveStatus : WAVESTATE;

var cutscenePrep : CameraCutscenePrep;
private var skipCutscene : boolean = false;

var ratingMenu : InGameRatingMenu;
var announceText : AnnounceText;

//spawn effect
var spawnHole : EnemyPool;

//spawning timers
private var isSpawning : boolean = false;
private var spawnTime : float;
private var curSpawnTime : float;

var normalSpawnTime : float = 1f;
var respawnSpawnTime : float = 2f;

//enemies with immediate spawn
var invul1Enemy : EnemyPool;
private var invul1Spawns : int;
private var invul1ToSpawn : int;

var invul2Enemy : EnemyPool;
private var invul2Spawns : int;
private var invul2ToSpawn : int;

var mine1Enemy : EnemyPool;
private var mine1Spawns : int;
private var mine1ToSpawn : int;

var mine2Enemy : EnemyPool;
private var mine2Spawns : int;
private var mine2ToSpawn : int;

//enemies with gradual spawn
var normalEnemies : NormalEnemySpawner[];

//powerups
var doubleShot : EnemyPool;
private var doubleShotDelay : int;
private var doubleShotPosition : int;
private var doubleShotCount : int;

var tripleShot : EnemyPool;
private var tripleShotDelay : int;
private var tripleShotPosition : int;
private var tripleShotCount : int;

//bosses
var healthBarManager : HealthBarManager;

var beeBoss : EnemyPool;
private var beeBossRemaining : int;

var scorpionBoss : EnemyPool;
private var scorpionBossRemaining : int;

var blockerBoss : EnemyPool;
private var blockerBossRemaining : int;

private var bossesSpawned : int;

private var spawnedBoss : GameObject;

//these enemies are spawned by other enemies, not by the wave directly
var spawnedEnemy1 : EnemyPool;
private var spawnedEnemies1Spawned : int;
private var spawned1ToSpawn : int;

var spawnedEnemy2 : EnemyPool;
private var spawnedEnemies2Spawned : int;
private var spawned2ToSpawn : int;

private var spawnsRemaining : boolean;

private var inputManager : InputManager;
private var status : GameStatus;

function Awake()
{
	inputManager = InputManager.Instance;
	status = GameObject.Find("GameStatus").GetComponent(GameStatus);
	
	status.GameStart();

	if( status.gameMode == GameStatus.MODE_DESCENT || status.gameMode == GameStatus.MODE_BOSS )
	{
		difficulty = status.difficulty;
		difficultyIncreaseModifier = increaseModifiers[status.difficulty];
		difficultyDecreaseModifier = decreaseModifiers[status.difficulty];
		speedTime *= difficultyIncreaseModifier;
		speedIncrement *= difficultyDecreaseModifier;
		updateIncrement *= difficultyDecreaseModifier;
	}
	else
	{
		difficulty = status.difficulty;
		difficultyIncreaseModifier = 1f;
		difficultyDecreaseModifier = 1f;
	}

	currentWave = (status.startOnWave > 0) ? status.startOnWave : status.startWave;
	Chartboost.Instance.cacheInterstitial();
}

function Start()
{
	ResetBoosts( true );
	
	if( status.gameMode == GameStatus.MODE_TEST )
	{
		SpawnDisplayTest();
		currentTime = 1000000f;
	}
	else
	{
		currentTime = 0f;
	}
	waveStatus = WAVESTATE.START_ANNOUNCE;
}

function Update()
{
	currentTime -= Time.deltaTime;
	if( waveStatus == WAVESTATE.RUNNING )
	{
		waveTime += Time.deltaTime;
	}
	
	if( playerDownTimer >= 0f )
	{
		playerDownTimer -= Time.deltaTime;
	}
	
	if( isSpawning )
	{
		SpawnWave();
	}
	
	if( currentTime <= 0f )
	{
		switch( waveStatus )
		{
			case WAVESTATE.START_ANNOUNCE:
				//Profiler.BeginSample("equationprep");
				levelDefinition.UpdateEquations( currentWave, true );
				//Profiler.EndSample();
				
#if UNITY_ANDROID && !UNITY_EDITOR
				if( levelDefinition.spawnEqs.lastEq.pause && levelDefinition.spawnEqs.lastEq.type == Globals.TYPE_CUTSCENE )
				{
					if( skipCutscene )
					{
						levelDefinition.UpdateEquations( currentWave, true );
					}
					else
					{
						cutscenePrep.RestrictFarPlane();
						waveStatus = WAVESTATE.CUTSCENE;
						pauseMenu.DisablePause();
						inputManager.EnterCutscene();
						Handheld.PlayFullScreenMovie(Globals.CUTSCENE_LIST[levelDefinition.spawnEqs.lastEq.enemy], Color.black, FullScreenMovieControlMode.CancelOnInput, FullScreenMovieScalingMode.AspectFill);
						break;
					}
				}
#else
				if( levelDefinition.spawnEqs.lastEq.pause && levelDefinition.spawnEqs.lastEq.type == Globals.TYPE_CUTSCENE )
				{
					levelDefinition.UpdateEquations( currentWave, true );
				}
#endif
				if( levelDefinition.spawnEqs.lastEq.pause && levelDefinition.spawnEqs.lastEq.type == Globals.TYPE_EXIT )
				{
					Application.LoadLevel("MainMenu");
					return;
				}

				background.SetBackground((currentWave-1) / 30);
				cutscenePrep.RestoreFarPlane();
				announceText.gameObject.SetActive(true);
				announceText.SetWave(currentWave);
				announceText.InitializePosition();
				//the text will tell us when to move on, set the time to be arbitrarily high
				currentTime = 100f;
				skipCutscene = false;
				break;
			case WAVESTATE.END_ANNOUNCE:
				waveStatus = WAVESTATE.RUNNING;
				//inputManager.FlurryFetchAd();
				Chartboost.Instance.cacheInterstitial();
				waveTime = 0f;
				currentTime = speedTime;
				PrepareWave( currentWave, true );
				break;
			case WAVESTATE.RUNNING:
				if( spawnsRemaining )
				{
					PrepareSpawn(false, false);
				}
				currentTime += speedTime;
				currentSpeed += speedIncrement;
				currentUpdate += updateIncrement;
				break;
			case WAVESTATE.RESPAWNING:
				//check for wave finished here too
				EnemyDestroyed(-1);
				if( waveStatus != WAVESTATE.FINISHED )
				{
					PrepareSpawn(false, true);
					currentTime += speedTime;
					waveStatus = WAVESTATE.RUNNING;
				}
				break;
			case WAVESTATE.FINISHED:
				if( levelDefinition.spawnEqs.lastEq.pause )
				{
					levelDefinition.UpdateEquations( currentWave, true );
					currentTime = 0f;
					currentSpeed -= speedIncrement;
					currentUpdate -= updateIncrement;
					PrepareWave( currentWave, false );
					waveStatus = WAVESTATE.RUNNING;
				}
				else
				{
					DespawnEnemies( true );
					ratingMenu.WaveFinished( currentWave );
					//the menu will tell us when to move on, set the time to be arbitrarily high
					currentTime = 100f;
				}
				break;
			case WAVESTATE.GAMEOVER:
				if( Mathf.Abs(Input.GetAxis("P1FireX")) > .2f || Mathf.Abs(Input.GetAxis("P1FireY")) > .2f ||
					Mathf.Abs(Input.GetAxis("P2FireX")) > .2f || Mathf.Abs(Input.GetAxis("P2FireY")) > .2f ||
					inputManager.GetKeyReleased(InputManager.IB_FIRE) )
				{
					var object : GameObject = GameObject.Find("GameStatus");
					if( object != null )
					{
						Destroy( object );
					}
					Application.LoadLevel("MainMenu");
				}
				break;
		}
	}
}

function OnApplicationPause( isPausing : boolean )
{
	if( !isPausing && waveStatus == WAVESTATE.CUTSCENE )
	{
		inputManager.LeaveCutscene();
		waveStatus = WAVESTATE.START_ANNOUNCE;
	}
}

function EndAnnounce()
{
	if( waveStatus == WAVESTATE.START_ANNOUNCE )
	{
		waveStatus = WAVESTATE.END_ANNOUNCE;
		currentTime = 0f;
	}
	else if( waveStatus == WAVESTATE.GAMEOVER )
	{
		currentTime = 0f;
	}
}

function EndRatingDisplay( rating : int )
{
	if( status.WaveFinished( currentWave, rating ) )
	{
		++currentWave;
		waveStatus = WAVESTATE.START_ANNOUNCE;
		ResetBoosts( true );
		currentTime = 0f;
		//inputManager.FlurryDisplayAd();
		Chartboost.Instance.showInterstitial();
	}
	else
	{
		//player has hit the next tier and does not have enough crystals to continue
		inputManager.LogFlurryEvent("progress_stopped", ["wave", currentWave.ToString(), "crystal_total", status.ratingTotal.ToString(), "difficulty", difficulty.ToString(), "players", GetPlayerCount().ToString()], false );
		waveStatus = WAVESTATE.GAMEOVER;
		currentTime = 1000000f;
		gameMenu.EnterMenu(tierLimitMenu);
	}
}

function RestartWave()
{
	// scorpion management based on enabling / disabling, so it does strange things
	// with health bars if it is allowed to get more of them
	healthBarManager.DenyRequests();
	DespawnEnemies(true);
	healthBarManager.AllowRequests();
	
	status.WaveReset( currentWave, 0 );
	
	ResetBoosts(true);
	levelDefinition.ResetEquations(currentWave);
	waveStatus = WAVESTATE.START_ANNOUNCE;
	isSpawning = false;
	skipCutscene = true;
}

function ResetBoosts( resetPowerups : boolean )
{
	var waveModifier : int = currentWave - (10 * ((currentWave-1) / 30));

	currentTime = speedTime;
	currentSpeed = 0f + (waveModifier * .05f * speedIncrement);
	currentUpdate = 0f + (waveModifier * .05f * updateIncrement);
	if( resetPowerups )
	{
		player1.gameObject.GetComponent(PlayerInput).NextWave();
		player2.gameObject.GetComponent(PlayerInput).NextWave();
		p1Score.NextWave( GetTargetLives(currentWave) );
		p2Score.NextWave( GetTargetLives(currentWave) );
	}
}

function GetEnemyCount( type : int ) : int
{
	var spawnInt : int;
	var spawned : int = 0;

	switch( type )
	{
		case Globals.EN_SPAWNED1:		spawned = spawnedEnemies1Spawned;
		case Globals.EN_SPAWNED2:		spawned = spawnedEnemies2Spawned;
		case Globals.EN_SPAWN1:
		case Globals.EN_SPAWN2:
			for( spawnInt = 0 ; spawnInt < normalEnemies.Length ; ++spawnInt )
			{
				if( type == normalEnemies[spawnInt].enemyType )
				{
					spawned = normalEnemies[spawnInt].toSpawn + normalEnemies[spawnInt].enemiesSpawned;
					break;
				}
			}
			break;
	}
	
	return spawned;
}

function EnemySpawned( type : int )
{
	switch( type )
	{
		case Globals.EN_SPAWNED1:		++spawnedEnemies1Spawned;	break;
		case Globals.EN_SPAWNED2:		++spawnedEnemies2Spawned;	break;
		case Globals.EN_BOSS_SCORPION:	++bossesSpawned;			break;
	}
}

function EnemyDestroyed( type : int )
{
	//type of -1 should skip decrement, just check for wave end
	if( type != -1 )
	{
		switch( type )
		{
			case Globals.EN_SPAWNED1:		--spawnedEnemies1Spawned;		break;
			case Globals.EN_SPAWNED2:		--spawnedEnemies2Spawned;		break;
			case Globals.EN_BOSS_BEE:		--bossesSpawned;				break;
			case Globals.EN_BOSS_SCORPION:	--bossesSpawned;				break;
		}
	}
	
	if( NormalEnemiesDestroyed() && spawnedEnemies1Spawned == 0 && spawnedEnemies2Spawned == 0 
	 && bossesSpawned == 0 )
	{
		if( !spawnsRemaining )
		{
			waveStatus = WAVESTATE.FINISHED;
			currentTime = 1f;
		}
		else
		{
			currentTime *= .5f;
		}
	}
}

function PlayerHit( playerDownTime : float )
{
// add this back in along with 2p not always clearing wave on death
//	if( (!player2.gameObject.active) || (player2.gameObject.active && playerDownTimer > 0f) )
//	{
		//Profiler.BeginSample("despawn");
		isSpawning = false;
		DespawnEnemies( false );
		ResetBoosts( false );
		waveStatus = WAVESTATE.RESPAWNING;
		currentTime = respawnTime;
		//Profiler.EndSample();
//	}
//	else
//	{
//		playerDownTimer = playerDownTime;
//	}
}

function UnsetPlayer( num : int )
{
	status.PlayerLeft( num );

	if( num == 1 )
	{
		player1.gameObject.SetActive(false);
		p1Score.ShowJoin();
		//p1Score.endWave = currentWave;
	}
	else if( num == 2 )
	{
		player2.gameObject.SetActive(false);
		p2Score.ShowJoin();
		//p2Score.endWave = currentWave;
	}
	
	if( !player1.gameObject.activeSelf && !player2.gameObject.activeSelf )
	{
		Application.LoadLevel("MainMenu");
		/*
		waveStatus = WAVESTATE.GAMEOVER;
		
		if( p1Score != null && p2Score != null && highScore.IsHighScore(p1Score.score) && highScore.IsHighScore(p2Score.score) )
		{
			if( p1Score.score >= p2Score.score )
			{
				highScore.AddHighScore(1, p1Score.endWave, p1Score.score);
				if( highScore.IsHighScore(p2Score.score) )
				{
					highScore.AddHighScore(2, p2Score.endWave, p2Score.score);
				}
			}
			else
			{
				highScore.AddHighScore(2, p2Score.endWave, p2Score.score);
				if( highScore.IsHighScore(p1Score.score) )
				{
					highScore.AddHighScore(1, p1Score.endWave, p1Score.score);
				}
			}
		}
		else
		{
			if( p1Score != null && highScore.IsHighScore( p1Score.score ) )
			{
				highScore.AddHighScore(1, p1Score.endWave, p1Score.score);
			}
			if( p2Score != null && highScore.IsHighScore( p2Score.score ) )
			{
				highScore.AddHighScore(2, p2Score.endWave, p2Score.score);
			}
		}
		
		announceText.GameOver(currentWave);
		announceText.InitializePosition();
		announceText.gameObject.SetActive(true);
		currentTime = 100000f;
		*/
	}
}

function GetPlayer() : Transform
{
	if( !player1.gameObject.activeSelf )
	{
		return player2;
	}
	else if( !player2.gameObject.activeSelf )
	{
		return player1;
	}
	else
	{
		return (Random.Range(0,2) == 0) ? player1 : player2;
	}
}

function GetPlayerCount() : int
{
	return (player1.gameObject.activeSelf ? 1 : 0) + (player2.gameObject.activeSelf ? 1 : 0);
}

function HandleControllerEvent( event : String )
{
	if( event == "1XC" )
	{
		p1Score.UpdateControllerState(true);
	}
	if( event == "1XD" )
	{
		p1Score.UpdateControllerState(false);
	}
	if( event == "2XC" )
	{
		p2Score.UpdateControllerState(true);
	}
	if( event == "2XD" )
	{
		p2Score.UpdateControllerState(false);
	}
}

//rating functions

function GetTimeRating() : float
{
	var targetTime : int = waveTime;
	targetTime = DescentSpawnEquations.descentTimes[currentWave-1] - targetTime;

	return Globals.RATING_TIME_BASE + (Globals.RATING_TIME_INCREMENT * targetTime);
}

function GetTargetLives( wave : int ) : int
{
	if( wave <= Globals.MAX_WAVES )
	{
		//currently assuming this is in story mode
		return DescentSpawnEquations.descentLives[currentWave-1] + 2 + (2 - difficulty);
	}
	return 0;	
}

function GetTargetEfficiency( wave : int ) : float
{
	if( wave <= Globals.MAX_WAVES )
	{
		//currently assuming this is in story mode
		return DescentSpawnEquations.descentEfficiency[currentWave-1];
	}
	return 0;
}

private function NormalEnemiesDestroyed() : boolean
{
	var i : int = 0;
	
	while( i < normalEnemies.Length )
	{
		if( (normalEnemies[i].enemiesSpawned != 0) || (normalEnemies[i].enemiesRemaining != 0) )
		{
			return false;
		}
		++i;
	}
	
	return true;
}

private function PrepareWave( wave : int, includeSpawn : boolean )
{
	//Profiler.BeginSample("waveprep");
	
	var i : int;
	spawnsRemaining = false;
	
	//need to spawn the mines and invincible enemies here so they get spawned only once
	invul1Spawns = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_INVUL1, wave);
	invul1ToSpawn = invul1Spawns;
	
	invul2Spawns = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_INVUL2, wave);
	invul2ToSpawn = invul2Spawns;

	mine1Spawns = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_MINE1, wave);
	mine1ToSpawn = mine1Spawns;
	
	mine2Spawns = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_MINE2, wave);
	mine2ToSpawn = mine2Spawns;
	
	for( i = 0 ; i < normalEnemies.Length ; ++i )
	{
		normalEnemies[i].PrepareWave( levelDefinition.spawnEqs, wave );
	}

	beeBossRemaining = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_BOSS_BEE, wave);
	scorpionBossRemaining = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_BOSS_SCORPION, wave);
	blockerBossRemaining = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_BOSS_BLOCKER, wave);

	bossesSpawned = 0;
	spawnedEnemies1Spawned = 0;
	spawnedEnemies2Spawned = 0;
	
	PreparePowerups( wave, includeSpawn );
	
	//Profiler.EndSample();
	
	if( includeSpawn )
	{
		PrepareSpawn( true, false );
	}
	else
	{
		spawnsRemaining = true;
		isSpawning = true;
		curSpawnTime = 0f;
		spawnTime = normalSpawnTime;
	}
}

private function PreparePowerups( wave : int, waveStarting : boolean )
{
	if( waveStarting || doubleShotCount == 0 )
	{
		doubleShotCount = levelDefinition.spawnEqs.Value(Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, wave);
		if( doubleShotCount > 0 )
		{
			doubleShotDelay = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_POWERUP_DOUBLE, wave);
			doubleShotPosition = levelDefinition.spawnEqs.Value(Globals.TYPE_SCREEN, Globals.EN_POWERUP_DOUBLE, wave);
		}
		else
		{
			doubleShotDelay = -1;
		}
	}

	if( waveStarting || tripleShotCount == 0 )
	{
		tripleShotCount = levelDefinition.spawnEqs.Value(Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, wave);
		if( tripleShotCount > 0 )
		{
			tripleShotDelay = levelDefinition.spawnEqs.Value(Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, wave);
			tripleShotPosition = levelDefinition.spawnEqs.Value(Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, wave);
		}
		else
		{
			tripleShotDelay = -1;
		}
	}
}

private function PrepareSpawn( firstSpawn : boolean, respawn : boolean )
{
	//Profiler.BeginSample("spawnprep");
	var i : int;
	spawnsRemaining = false;
	
	if( respawn )
	{
		invul1ToSpawn = invul1Spawns;
		invul2ToSpawn = invul2Spawns;
	}
	
	for( i = 0 ; i < normalEnemies.Length ; ++i )
	{
		spawnsRemaining = normalEnemies[i].PrepareSpawn( respawn ) || spawnsRemaining;
	}

	if( respawn )
	{
		spawned1ToSpawn = spawnedEnemies1Spawned;
		spawned2ToSpawn = spawnedEnemies2Spawned;
	}
	
	if( firstSpawn )
	{
		if( beeBossRemaining != 0 )
		{
			--beeBossRemaining;
			++bossesSpawned;
			spawnedBoss = beeBoss.Allocate();
			spawnedBoss.transform.localRotation = beeBoss.template.transform.localRotation;
			spawnedBoss.SetActive(true);
		}

		if( scorpionBossRemaining != 0 )
		{
			--scorpionBossRemaining;
			++bossesSpawned;
			spawnedBoss = scorpionBoss.Allocate();
			spawnedBoss.SetActive(true);
		}

		if( blockerBossRemaining != 0 )
		{
			--blockerBossRemaining;
			++bossesSpawned;
			spawnedBoss = blockerBoss.Allocate();
			spawnedBoss.transform.localRotation = blockerBoss.template.transform.localRotation;
			spawnedBoss.SetActive(true);
		}
	}
	
	isSpawning = spawnsRemaining || respawn || firstSpawn;
	curSpawnTime = 0f;
	spawnTime = respawn ? respawnSpawnTime : normalSpawnTime;

	SpawnPowerups( firstSpawn );
	
	//Profiler.EndSample();
}

private function SpawnPowerups( firstSpawn : boolean )
{
	if( doubleShotDelay > 0 )
	{
		--doubleShotDelay;
		if( doubleShotDelay == 0 )
		{
			doubleShotDelay = -1;
			if( doubleShotPosition == 0 )
			{
				SpawnCentered( doubleShot, (player1.gameObject.activeSelf && player2.gameObject.activeSelf) ? powerupCenterOffset : 0 );
				if( doubleShotCount == 2 && player1.gameObject.activeSelf && player2.gameObject.activeSelf )
				{
					SpawnCentered( doubleShot, -powerupCenterOffset );
				}
			}
			else
			{
				SpawnFromPool( doubleShot, false );
				if( doubleShotCount == 2 && player1.gameObject.activeSelf && player2.gameObject.activeSelf )
				{
					SpawnFromPool( doubleShot, false );
				}
			}
		}
	}

	if( tripleShotDelay > 0 )
	{
		--tripleShotDelay;
		if( tripleShotDelay == 0 )
		{
			tripleShotDelay = -1;
			if( tripleShotPosition == 0 )
			{
				SpawnCentered( tripleShot, (player1.gameObject.activeSelf && player2.gameObject.activeSelf) ? powerupCenterOffset : 0 );
				if( tripleShotCount == 2 && player1.gameObject.activeSelf && player2.gameObject.activeSelf )
				{
					SpawnCentered( tripleShot, -powerupCenterOffset );
				}
			}
			else
			{
				SpawnFromPool( tripleShot, false );
				if( tripleShotCount == 2 && player1.gameObject.activeSelf && player2.gameObject.activeSelf )
				{
					SpawnFromPool( tripleShot, false );
				}
			}
		}
	}
}

private function SpawnWave()
{
	//Profiler.BeginSample("spawnspecial");
	curSpawnTime += Time.deltaTime;
	
	var spawnRatio : float = 1f - (curSpawnTime / spawnTime);
	var spawnInt : int;
	var finishSpawn : boolean = spawnRatio <= 0f;

	spawnInt = finishSpawn ? 0 : (invul1Spawns * spawnRatio);
	while( invul1ToSpawn > spawnInt )
	{
		SpawnFromPool( invul1Enemy, true );
		--invul1ToSpawn;
	}
	
	spawnInt = finishSpawn ? 0 : (invul2Spawns * spawnRatio);
	while( invul2ToSpawn > spawnInt )
	{
		SpawnFromPool( invul2Enemy, true );
		--invul2ToSpawn;
	}

	spawnInt = finishSpawn ? 0 : (mine1Spawns * spawnRatio);
	while( mine1ToSpawn > spawnInt )
	{
		SpawnFromPool( mine1Enemy, false );
		--mine1ToSpawn;
	}

	spawnInt = finishSpawn ? 0 : (mine2Spawns * spawnRatio);
	while( mine2ToSpawn > spawnInt )
	{
		SpawnFromPool( mine2Enemy, false );
		--mine2ToSpawn;
	}

	spawnInt = finishSpawn ? 0 : (spawnedEnemies1Spawned * spawnRatio);
	while( spawned1ToSpawn > spawnInt )
	{
		SpawnFromPool( spawnedEnemy1, true );
		--spawned1ToSpawn;
	}

	spawnInt = finishSpawn ? 0 : (spawnedEnemies2Spawned * spawnRatio);
	while( spawned2ToSpawn > spawnInt )
	{
		SpawnFromPool( spawnedEnemy2, true );
		--spawned2ToSpawn;
	}
	
	//Profiler.EndSample();
	//Profiler.BeginSample("spawnnormal");

	spawnsRemaining = (invul1ToSpawn > 0) || (invul2ToSpawn > 0) || (mine1ToSpawn > 0) 
		|| (mine2ToSpawn > 0) || (spawned1ToSpawn > 0) || (spawned2ToSpawn > 0);
	for( spawnInt = 0 ; spawnInt < normalEnemies.Length ; ++spawnInt )
	{
		spawnsRemaining = normalEnemies[spawnInt].SpawnEnemies( spawnRatio, finishSpawn ) || spawnsRemaining;
	}
	
	//Profiler.EndSample();
	
	isSpawning = spawnsRemaining && !finishSpawn;
	
	// potentially the last things spawning were enemies that won't trigger a wave 
	// ending, so check here when the spawn is finished in case the spawning flag
	// was the only reason the wave didn't end
	if( !isSpawning )
	{
		EnemyDestroyed(-1);
	}
}

private function SpawnCentered( pool : EnemyPool, xOffset : float ) : boolean
{
	var obj : GameObject = pool.Allocate();

	if( !obj )
	{
		return false;
	}

	obj.transform.localPosition.x = xOffset;
	obj.transform.localPosition.z = 0f;
	
	obj.SetActive(true);
	obj.SendMessage("SetPlayer", GetPlayer(), SendMessageOptions.DontRequireReceiver);
	obj.SendMessage("SetDifficultyIncrease", difficultyIncreaseModifier, SendMessageOptions.DontRequireReceiver);
	
	return true;
}

function SpawnFromPool( pool : EnemyPool, useHole : boolean ) : boolean
{
	var x : float;
	var z : float;
	var obj : GameObject = pool.Allocate();

	if( !obj )
	{
		return false;
	}

	x = Random.Range(-Globals.levelxBounds, Globals.levelxBounds);
	z = Random.Range(-Globals.levelzBounds, Globals.levelzBounds);
	while( ((player1.gameObject.activeSelf) && (Mathf.Abs(x - player1.localPosition.x) + Mathf.Abs(z - player1.localPosition.z)) < spawnDistanceFromPlayer)
		|| ((player2.gameObject.activeSelf) && (Mathf.Abs(x - player2.localPosition.x) + Mathf.Abs(z - player2.localPosition.z)) < spawnDistanceFromPlayer))
	{
		x = Random.Range(-Globals.levelxBounds, Globals.levelxBounds);
		z = Random.Range(-Globals.levelzBounds, Globals.levelzBounds);
	}
	
	obj.transform.localPosition.x = x;
	obj.transform.localPosition.z = z;
	
	obj.SetActive(true);
	obj.SendMessage("SetPlayer", GetPlayer(), SendMessageOptions.DontRequireReceiver);
	obj.SendMessage("SetDifficultyIncrease", difficultyIncreaseModifier, SendMessageOptions.DontRequireReceiver);
	
	if( useHole )
	{
		obj = spawnHole.Allocate();
		if( obj != null )
		{
			obj.transform.localPosition.x = x;
			obj.transform.localPosition.z = z;
			obj.SetActive(true);
		}
	}
	
	return true;
}

private function DespawnEnemies( allEnemies : boolean )
{
	var health : EnemyHealth;
	var comp : PoolObject;
	
	invul1Spawns = invul1ToSpawn;
	invul2Spawns = invul2ToSpawn;

	for( var i : int = 0 ; i < normalEnemies.Length ; ++i )
	{
		normalEnemies[i].PlayerDied();
	}

	if( allEnemies )
	{
		for( var obj : GameObject in GameObject.FindGameObjectsWithTag("Powerup") )
		{
			obj.GetComponent(PoolObject).PoolRelease();
		}
	}

	for( var obj : GameObject in GameObject.FindGameObjectsWithTag("Enemy") )
	{
		//check type of enemies with health, just release anything without a health component
		health = obj.GetComponent(EnemyHealth);
		if( health )
		{
			switch( health.myType )
			{
				case Globals.EN_INVUL1:
					++invul1Spawns;
					break;
				case Globals.EN_INVUL2:
					++invul2Spawns;
					break;
				case Globals.EN_MINE1:
					if( !allEnemies )
					{
						continue;
					}
					break;
				case Globals.EN_MINE2:
				case Globals.EN_BOSS_BEE:
				case Globals.EN_BOSS_SCORPION:
					if( !allEnemies )
					{
						obj.SendMessage( "PlayerHit", respawnTime, SendMessageOptions.DontRequireReceiver );
						continue;
					}
					break;
			}
		}

		comp = obj.GetComponent(PoolObject);
		if( comp != null )
		{
			comp.PoolRelease();
		}
		else
		{
			Destroy( obj );
		}
	}

	invul1ToSpawn = invul1Spawns;
	invul2ToSpawn = invul2Spawns;
}

private function SpawnDisplayTest()
{
	invul1Enemy.SpawnDisplayObject(Vector3(14f, 0f, -9f), player1);
	invul2Enemy.SpawnDisplayObject(Vector3(12f, 0f, -9f), player1);

	mine1Enemy.SpawnDisplayObject(Vector3(14f, 0f, -7f), player1);
	mine2Enemy.SpawnDisplayObject(Vector3(12f, 0f, -7f), player1);

	normalEnemies[0].enemy.SpawnDisplayObject(Vector3(14f, 0f, -5f), player1);
	normalEnemies[1].enemy.SpawnDisplayObject(Vector3(12f, 0f, -5f), player1);
	
	normalEnemies[2].enemy.SpawnDisplayObject(Vector3(14f, 0f, -3f), player1);
	normalEnemies[3].enemy.SpawnDisplayObject(Vector3(12f, 0f, -3f), player1);
	
	normalEnemies[4].enemy.SpawnDisplayObject(Vector3(14f, 0f, -1f), player1);
	normalEnemies[5].enemy.SpawnDisplayObject(Vector3(12f, 0f, -1f), player1);
	
	normalEnemies[6].enemy.SpawnDisplayObject(Vector3(14f, 0f, 3f), player1);
	normalEnemies[7].enemy.SpawnDisplayObject(Vector3(12f, 0f, 3f), player1);

	spawnedEnemy1.SpawnDisplayObject(Vector3(14f, 0f, 1f), player1);
	spawnedEnemy2.SpawnDisplayObject(Vector3(12f, 0f, 1f), player1);
	
	doubleShot.SpawnDisplayObject(Vector3(-2f, 0f, -9f), player1);
	tripleShot.SpawnDisplayObject(Vector3(2f, 0f, -9f), player1);
	
	beeBoss.SpawnDisplayObject(Vector3(-11f, 0f, 6f), player1);

	scorpionBoss.SpawnDisplayObject(Vector3(-11f, 0f, 0f), player1);
	
	blockerBoss.SpawnDisplayObject(Vector3(-11f, 0f, -6f), player1);
}
