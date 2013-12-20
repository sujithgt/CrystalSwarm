#pragma strict

var enemy : EnemyPool;

var enemiesSpawned : int;
var enemiesRemaining : int;
var enemiesOnScreen : int;
var enemiesPerSpawn : int;
var toSpawn : int;

var currentSpawnTotal : int;

var enemyType : int;

var levelSpawner : LevelSpawner;

private var currentSpawns : int;
private var i : int;

function PrepareWave( eqs : SpawnEqHolder, wave : int )
{
	enemiesRemaining = eqs.Value(Globals.TYPE_COUNT, enemyType, wave);
	enemiesOnScreen = eqs.Value(Globals.TYPE_SCREEN, enemyType, wave);
	enemiesPerSpawn = eqs.Value(Globals.TYPE_SPAWN, enemyType, wave);
}

function PrepareSpawn( respawn : boolean ) : boolean
{
	if( !respawn )
	{
		toSpawn = Mathf.Min(enemiesRemaining, enemiesPerSpawn);
		toSpawn = Mathf.Min(toSpawn, enemiesOnScreen - enemiesSpawned);
		currentSpawnTotal = toSpawn;
	}

	return enemiesRemaining > 0;
}

function SpawnEnemies( spawnRatio : float, finishSpawn : boolean )
{
	if( toSpawn == 0 )
	{
		return enemiesRemaining > 0;
	}

	currentSpawns = finishSpawn ? toSpawn : toSpawn - (currentSpawnTotal * spawnRatio);
	
	while( currentSpawns > 0 )
	{
		if( levelSpawner.SpawnFromPool( enemy, true ) )
		{
			++enemiesSpawned;
			--enemiesRemaining;
			--currentSpawns;
			--toSpawn;
		}
		else
		{
			currentSpawns = 0;
			toSpawn = 0;
		}
	}
	
	return enemiesRemaining > 0;
}

function EnemySpawned( type : int )
{
	if( type == enemyType )
	{
		++enemiesSpawned;
	}
	else
	{
		Debug.LogError("Sent spawn message of " + type + " to reciever for " + enemyType );
	}
}

function EnemyDestroyed( type : int )
{
	if( type == enemyType )
	{
		--enemiesSpawned;
		if( enemiesSpawned == 0 )
		{
			levelSpawner.EnemyDestroyed(-1);
		}
	}
	else
	{
		Debug.LogError("Sent destroy message of " + type + " to reciever for " + enemyType );
	}
}

function PlayerDied()
{
	toSpawn += enemiesSpawned;
	currentSpawnTotal = toSpawn;
	enemiesRemaining += enemiesSpawned;
	enemiesSpawned = 0;
}
