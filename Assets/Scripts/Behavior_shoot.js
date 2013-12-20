#pragma strict

var trans : Transform;
var behavior : Behavior_8wayrandom;

var levelSpawner : LevelSpawner;

var minUpdateTime : float = 2f;
var maxUpdateTime : float = 3f;
private var curMinUpdate : float;
private var curMaxUpdate : float;
private var nextUpdate : float;

var bullet : EnemyPool;
var needsTarget : boolean = false;
var speedMultiplier : float = 1.5f;
private var lastBullet : GameObject;
private var lastBulletTrans : Transform;
private var bulletSpeed : float;

var threeWay : boolean = false;
var tripleSpeedMult : float = .8f;

var enterMinDelay : float = .6f;
var enterMaxDelay : float = 1f;

var fireSound : AudioClip;
var audioSource : SoundController;

var bulletExtraSpeed : float = 0f;

var doesSpawn : boolean = true;
private var isSpawning : boolean;
var spawnTime : float = .3f;

function OnDisable()
{
	isSpawning = doesSpawn;
}

function OnEnable()
{
	curMinUpdate = minUpdateTime;
	curMaxUpdate = maxUpdateTime;

	nextUpdate = Random.Range(Mathf.Max(.75f,curMinUpdate-levelSpawner.currentUpdate), curMaxUpdate-levelSpawner.currentUpdate);
	nextUpdate *= Random.Range(enterMinDelay, enterMaxDelay);
	
	if( isSpawning )
	{
		nextUpdate += spawnTime;
	}
}

function TestMode()
{
	nextUpdate = 1000000f;
}

function PlayerHit( delay : float )
{
	nextUpdate += delay;
}

function Update()
{
	nextUpdate -= Time.deltaTime;
	
	if( nextUpdate <= 0 )
	{
		nextUpdate = Random.Range(Mathf.Max(.75f,curMinUpdate-levelSpawner.currentUpdate), curMaxUpdate-levelSpawner.currentUpdate);
		audioSource.Play(fireSound);

		if( behavior.speedMultiplier < .005f )
		{
			bulletSpeed = bulletExtraSpeed + (levelSpawner.currentSpeed * speedMultiplier);
		}
		else
		{
			bulletSpeed = bulletExtraSpeed + ((behavior.baseSpeed + (levelSpawner.currentSpeed * behavior.speedMultiplier)) * speedMultiplier);
		}
		
		FireBullet( behavior.dir, bulletSpeed );
		
		if( threeWay )
		{
			bulletSpeed *= tripleSpeedMult;
			FireBullet( (behavior.dir + 6) % 8, bulletSpeed );
			FireBullet( (behavior.dir + 2) % 8, bulletSpeed );
		}
	}
}

function SetDifficultyIncrease( modifier : float )
{
	curMinUpdate = minUpdateTime * modifier;
	curMaxUpdate = maxUpdateTime * modifier;

	nextUpdate = Random.Range(Mathf.Max(.75f,curMinUpdate-levelSpawner.currentUpdate), curMaxUpdate-levelSpawner.currentUpdate);
}

private function FireBullet( fireDir : int, fireSpeed : float )
{
	lastBullet = bullet.Allocate();
	if( lastBullet != null )
	{
		lastBulletTrans = lastBullet.transform;
		lastBulletTrans.localPosition.x = trans.localPosition.x;
		lastBulletTrans.localPosition.z = trans.localPosition.z;
		lastBullet.SetActive(true);
		lastBullet.SendMessage("SetVelocity", Vector3(fireDir, fireSpeed, 0f));
		if( needsTarget )
		{
			lastBullet.SendMessage("SetPlayer", levelSpawner.GetPlayer());
		}
	}
}