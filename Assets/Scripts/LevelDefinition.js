#pragma strict

private var gameStatus : GameStatus;

private var levelSpawns : SpawnEq[];
private var spawnIndex : int;

var spawner : LevelSpawner;

class SpawnEqHolder
{
	private var spawnEquations : SpawnEq[];
	private var screenEquations : SpawnEq[];
	private var totalEquations : SpawnEq[];
	
	private var difficultyDecreaseModifier : float;
	private var difficultyIncreaseModifier : float;
	
	var lastEq : SpawnEq;
	
	function SpawnEqHolder( diffDecrease : float, diffIncrease : float )
	{
		spawnEquations = new SpawnEq[Globals.EN_END];
		screenEquations = new SpawnEq[Globals.EN_END];
		totalEquations = new SpawnEq[Globals.EN_END];

		difficultyDecreaseModifier = diffDecrease;
		difficultyIncreaseModifier = diffIncrease;
	}
	
	function AddEq( eq : SpawnEq )
	{
		lastEq = eq;
		switch( eq.type )
		{
			case Globals.TYPE_CLEAR:
				Clear();
				break;
			case Globals.TYPE_SPAWN:
				spawnEquations[eq.enemy] = eq;
				break;
			case Globals.TYPE_SCREEN:
				screenEquations[eq.enemy] = eq;
				break;
			case Globals.TYPE_COUNT:
				totalEquations[eq.enemy] = eq;
				break;
			case Globals.TYPE_BLANK:
				//these only exist to be able to specify a blank pause, so do nothing here
				break;
		}
	}
	
	function Clear()
	{
		for( var i : int = 0 ; i < Globals.EN_END ; ++i )
		{
			spawnEquations[i] = null;
			screenEquations[i] = null;
			totalEquations[i] = null;
		}
	}
	
	function Value( type : int, enemy : int, wave : int ) : int
	{
		var eq : SpawnEq;
		var adjustDifficulty : boolean = (enemy < Globals.EN_POWERUP_DOUBLE) || (enemy > Globals.EN_POWERUP_OTHER6);
		var val : int = 0;
		var sub : int = 0;
		
		switch( type )
		{
			case Globals.TYPE_SPAWN:
				eq = spawnEquations[enemy];
				break;
			case Globals.TYPE_SCREEN:
				eq = screenEquations[enemy];
				break;
			case Globals.TYPE_COUNT:
				eq = totalEquations[enemy];
				break;
		}
		
		if( eq != null )
		{
			val = eq.Value(wave);
			if( adjustDifficulty )
			{
				sub = (1f - difficultyDecreaseModifier) * val;
				val -= sub;
			}
			return val;
		}
		return 0;
	}
}

var spawnEqs : SpawnEqHolder;

function Awake()
{
	enabled = false;
	
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);

	if( gameStatus.gameMode == GameStatus.MODE_SURVIVAL )
	{
		levelSpawns = SurvivalSpawnEquations.survivalSetup;
	}
	else if( gameStatus.gameMode == GameStatus.MODE_DESCENT )
	{
		levelSpawns = DescentSpawnEquations.descentSetup;
	}
	else if( gameStatus.gameMode == GameStatus.MODE_BOSS )
	{
		levelSpawns = BossSpawnEquations.bossSetup;
	}
	
	spawnEqs = new SpawnEqHolder(spawner.difficultyDecreaseModifier, spawner.difficultyIncreaseModifier);

	var startingWave : int = (gameStatus.startOnWave >= 0) ? gameStatus.startOnWave : gameStatus.startWave;

	spawnIndex = 0;
	if( startingWave > 1 )
	{
		UpdateEquations( startingWave - 1, false );
	}
}

function UpdateEquations( wave : int, allowPause : boolean )
{
	while( spawnIndex < levelSpawns.Length && levelSpawns[spawnIndex].wave <= wave )
	{
		spawnEqs.AddEq( levelSpawns[spawnIndex] );
		++spawnIndex;
		
		if( allowPause && spawnEqs.lastEq.pause )
		{
			return;
		}
	}
}

function ResetEquations( wave : int )
{
	spawnEqs.Clear();
	spawnIndex = 0;
	if( wave > 1 )
	{
		UpdateEquations( wave - 1, false );
	}
}

/*
function GetInvincibleEnemyCount( level : int ) : int
{
	var count : int = Mathf.Min(level + (level / 2), 30);
	
	if( level >= 6 && level % 2 == 0 )
	{
		count -= 2;
	}
	
	return count;
}

function GetBasicEnemy1Count( level : int ) : int
{
	var count : int;
	
	if( level <= 8 )
	{
		count = (level * 10) - 4;
	}
	else if( level <= 12 )
	{
		count = (level * 8);
	}
	else
	{
		count = (level * 6);
	}
	
	if( level >= 6 && level % 2 == 0 )
	{
		count -= level;
	}

	return count;
}

function GetBasicEnemy1SpawnLimit( level : int ) : int
{
	var count : int;
	
	if( level <= 10 )
	{
		count = level * 2;
	}
	else
	{
		count = level;
	}
	
	if( level >= 6 && level % 2 == 0 )
	{
		count -= level / 4;
	}

	return count;
}

function GetBasicEnemy1ScreenLimit( level : int ) : int
{
	var count : int = Mathf.Min(level * 5, 35);
	
	if( level >= 6 && level % 2 == 0 )
	{
		count -= 3;
	}

	return count;
}

function GetBasicEnemy2Count( level : int ) : int
{
	var count : int;
	
	if( level <= 8 )
	{
		count = 0;
	}
	else if( level <= 12 )
	{
		count = (level * 3);
	}
	else
	{
		count = (level * 5);
	}

	if( level >= 10 && level % 2 == 0 )
	{
		count -= level / 2;
	}

	return count;
}

function GetBasicEnemy2SpawnLimit( level : int ) : int
{
	var count : int = Mathf.Max(0, Mathf.Min(level - 5, 20));

	if( level >= 10 && level % 2 == 0 )
	{
		count -= Mathf.Min(level / 6, 3);
	}

	return count;
}

function GetBasicEnemy2ScreenLimit( level : int ) : int
{
	var count : int = Mathf.Min(level, 25);
	
	if( level >= 10 && level % 2 == 0 )
	{
		count -= 3;
	}

	return count;
}

function GetSpawnerEnemy1Count( level : int ) : int
{
	var count : int = 0;
	
	if( level >= 6 && (level % 2) == 0 )
	{
		count = level;
	}

	return count;
}

function GetSpawnerEnemy1SpawnLimit( level : int ) : int
{
	return Mathf.Min( 1 + (level / 4), 4 );
}

function GetSpawnerEnemy1ScreenLimit( level : int ) : int
{
	return Mathf.Min( 1 + (level / 3), 6 );
}

function GetMineEnemyCount( level : int ) : int
{
	return Mathf.Min( 2 * (level-1), 60 );
}
*/
