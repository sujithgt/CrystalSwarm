#pragma strict

var trans : Transform;
var spawned : EnemyPool;
var spawnedType : int = Globals.EN_SPAWNED1;
var spawnAnim : String = "";

var levelSpawner : LevelSpawner;
var sendSpawnData : boolean = true;

var minUpdateTime : float = 4f;
var maxUpdateTime : float = 6f;
private var curMinUpdate : float;
private var curMaxUpdate : float;
private var nextUpdate : float;

var watchedEnemy : int = -1;
var watchDelay : float = .05f;

var enterMinDelay : float = .6f;
var enterMaxDelay : float = 1f;

private var difficultyIncreaseModifier : float;

private var lastSpawned : GameObject;
private var lastSpawnedTrans : Transform;

var doesSpawn : boolean = true;
private var isSpawning : boolean;
var spawnTime : float = .3f;

var spawnSound : AudioClip;
var audioSource : SoundController;

function OnDisable()
{
	isSpawning = doesSpawn;
}

function OnEnable()
{
	curMinUpdate = minUpdateTime;
	curMaxUpdate = maxUpdateTime;

	if( isSpawning )
	{
		nextUpdate = spawnTime;
	}
	else
	{
		nextUpdate = Random.Range(Mathf.Max(2f,curMinUpdate-(2f*levelSpawner.currentUpdate)), curMaxUpdate-(2f*levelSpawner.currentUpdate));
		nextUpdate *= Random.Range(enterMinDelay, enterMaxDelay);
		if( watchedEnemy >= 0 )
		{
			nextUpdate += levelSpawner.GetEnemyCount( watchedEnemy ) * watchDelay;
		}
	}
}

function TestMode()
{
	nextUpdate = 1000000f;
}

function Update()
{
	nextUpdate -= Time.deltaTime;
	
	if( isSpawning )
	{
		if( nextUpdate <= 0f )
		{
			isSpawning = false;
		}
		else
		{
			//don't move while spawning
			return;
		}
	}

	if( nextUpdate <= 0f )
	{
		nextUpdate = Random.Range(Mathf.Max(2f,curMinUpdate-(2f*levelSpawner.currentUpdate)), curMaxUpdate-(2f*levelSpawner.currentUpdate));
		if( watchedEnemy >= 0 )
		{
			var count : int = levelSpawner.GetEnemyCount( watchedEnemy );
			nextUpdate += count * watchDelay;

			if( count >= spawned.size )
			{
				//cancel the spawn if it will spawn more than the pool capacity limit
				return;
			}
		}

		lastSpawned = spawned.Allocate();
		if( lastSpawned != null )
		{
			if( spawnSound != null )
			{
				audioSource.Play(spawnSound);
			}
			lastSpawned.SetActive(true);
			lastSpawnedTrans = lastSpawned.transform;
			lastSpawnedTrans.localPosition.x = trans.localPosition.x;
			lastSpawnedTrans.localPosition.z = trans.localPosition.z;
			
			if( sendSpawnData )
			{
				lastSpawned.SendMessage("SetPlayer", levelSpawner.GetPlayer(), SendMessageOptions.DontRequireReceiver);
				lastSpawned.SendMessage("SetDifficultyIncrease", difficultyIncreaseModifier, SendMessageOptions.DontRequireReceiver);
				levelSpawner.EnemySpawned( spawnedType );
				
				if( spawnAnim.Length > 0 )
				{
					lastSpawned.GetComponent(AnimationControl).StartAnimation(spawnAnim);
				}
			}
		}
	}
}

function SetDifficultyIncrease( modifier : float )
{
	difficultyIncreaseModifier = modifier;
	
	curMinUpdate = minUpdateTime * modifier;
	curMaxUpdate = maxUpdateTime * modifier;

	nextUpdate = Random.Range(Mathf.Max(2f,curMinUpdate-(2f*levelSpawner.currentUpdate)), curMaxUpdate-(2f*levelSpawner.currentUpdate));
	nextUpdate *= Random.Range(enterMinDelay, enterMaxDelay);
	if( watchedEnemy >= 0 )
	{
		nextUpdate += levelSpawner.GetEnemyCount( watchedEnemy ) * watchDelay;
	}
}
