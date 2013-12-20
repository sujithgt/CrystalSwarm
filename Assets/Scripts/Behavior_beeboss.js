#pragma strict

//general variables
private var difficulty : int;
private var difficultyIncreaseModifier : float;
private var difficultyDecreaseModifier : float;

private var i : int;

var trans : Transform;
var health : EnemyHealth;
var healthBarManager : HealthBarManager;
private var startHealth : int;
private var curHealth : int;
private var healthBarIndex : int;

//spawning variables
var levelSpawner : LevelSpawner;
var spawn1Spawner : NormalEnemySpawner;

var spawned : EnemyPool;
var spawnedType : int = Globals.EN_SPAWN1;
var spawnAnim : String = "altspawn";
private var lastSpawned : GameObject;
private var lastSpawnedTrans : Transform;

var spawnTime : float = 7;
private var nextSpawnTime : float;

var spawnOffsetL : Vector3;
var spawnOffsetC : Vector3;
var spawnOffsetR : Vector3;

//shooting variables
var bullet : EnemyPool;
var bulletSpeed : float = 2f;

private var targetIsP1 : boolean;
private var player1 : Transform;
private var player2 : Transform;

private var lastBullet : GameObject;
private var lastBulletTrans : Transform;
private var bulletMainRotationAngle : float;
private var bulletMainDirection : Vector3;
private var bulletSideDirection : Vector3;
private var bulletFired : boolean;

var shootTime : float = .7f;
private var nextShootTime : float;

var shotDegreeOffset : float = 10f;
private var shotRadianOffset : float;
private var shotOffsetCos : float;
private var shotOffsetSin : float;

var fireSound : AudioClip;
var audioSource : SoundController;

//movement variables
var fastestHealth : int = 20;
var healthSpeedUpdate : int = 5;
private var nextSpeedUpdate : int;

var centerHeight : float = -5f;
var centerWidth : float = 12f;
var enterHeight : float = -15f;
var enterSpeed : float = 3f;
private var entering : boolean = true;
private var curCenterHeight : float;
private var curCenterWidth : float;

var minOmega : float = 1;
var maxOmega : float = 3.5;
private var curOmega : float = minOmega;
private var curTheta : float = Mathf.PI / 2f;

var minCenterVel : float = 1f;
var maxCenterVel : float = 3f;
private var maxCenter : float = centerWidth;
private var curCenter : float = 0f;
private var curCenterVel : float = minCenterVel;
private var curCenterVelX : boolean = true;

var minRadius : float = 1f;
var maxRadius : float = 3f;
var minRadiusVel : float = .2f;
var maxRadiusVel : float = 1f;
private var curRadius : float = minRadius;
private var curRadiusVel : float = minRadiusVel;

function OnEnable()
{
	if( !gameObject.activeSelf )
	{
		return;
	}

	Initialize();
}

private function Initialize()
{
	nextSpawnTime = spawnTime;
	
	difficulty = levelSpawner.difficulty;
	difficultyIncreaseModifier = levelSpawner.difficultyIncreaseModifier;
	difficultyDecreaseModifier = levelSpawner.difficultyDecreaseModifier;
	
	minRadiusVel *= levelSpawner.difficultyDecreaseModifier;
	maxRadiusVel *= levelSpawner.difficultyDecreaseModifier;

	player1 = levelSpawner.player1;
	player2 = levelSpawner.player2;
	targetIsP1 = (player1.gameObject.activeSelf);
	
	nextSpawnTime = spawnTime * difficultyIncreaseModifier;
	nextShootTime = shootTime * difficultyIncreaseModifier;
	
	shotRadianOffset = shotDegreeOffset * difficultyIncreaseModifier * (Mathf.PI / 180f);
	shotOffsetCos = Mathf.Cos( shotRadianOffset );
	shotOffsetSin = Mathf.Sin( shotRadianOffset );
	
	healthBarIndex = healthBarManager.RequestHealthBar(health, HEALTHBARSIDES.HB_CENTER);
	startHealth = health.health;
	curHealth = startHealth;
	fastestHealth = (startHealth * fastestHealth) / 100;
	healthSpeedUpdate = (startHealth * healthSpeedUpdate) / 100;
	nextSpeedUpdate = curHealth - healthSpeedUpdate;

	curCenterHeight = centerHeight;
	curCenterWidth = centerWidth;
	curOmega = minOmega;
	curTheta = Mathf.PI / 2f;
	maxCenter = centerWidth;
	curCenter = 0f;
	curCenterVel = minCenterVel;
	curCenterVelX = true;
	curRadius = minRadius;
	curRadiusVel = minRadiusVel;

	trans.localPosition.x = curCenter;
	trans.localPosition.z = enterHeight;
	
	entering = true;
}

function OnDisable()
{
	healthBarManager.ReleaseHealthBar(healthBarIndex);
}

function TestMode()
{
	enabled = false;
}

function Update()
{
	if( entering )
	{
		trans.localPosition.z += enterSpeed * Time.deltaTime;
		if( trans.localPosition.z >= (curCenterHeight + curRadius) )
		{
			trans.localPosition.z = curCenterHeight + curRadius;
			entering = false;
		}
		return;
	}

	nextSpawnTime -= Time.deltaTime;
	nextShootTime -= Time.deltaTime;
	curHealth = health.health;

	if( curHealth <= nextSpeedUpdate )
	{
		UpdateSpeeds();
		if( nextSpeedUpdate <= fastestHealth )
		{
			nextSpeedUpdate = -1;
		}
		else
		{
			nextSpeedUpdate -= healthSpeedUpdate;
		}
	}
	
	UpdatePosition();
	
	if( nextSpawnTime <= 0f )
	{
		var count : int = levelSpawner.GetEnemyCount(spawnedType);
		nextSpawnTime += difficultyIncreaseModifier * (spawnTime + (.5f * count));
		
		i = 0;
		if( (count + difficulty + 1) > spawned.size )
		{
			i = count + difficulty + 1 - spawned.size;
		}
		
		for( ; i <= difficulty ; ++i )
		{
			lastSpawned = spawned.Allocate();
			if( lastSpawned == null )
			{
				Debug.LogError("boss spawn hit limit");
				break;
			}
			lastSpawnedTrans = lastSpawned.transform;
			lastSpawnedTrans.localPosition = trans.localPosition;
			switch( difficulty + i )
			{
				case 0:	case 4:	lastSpawnedTrans.localPosition += trans.localRotation * spawnOffsetC;	break;
				case 1: case 3:	lastSpawnedTrans.localPosition += trans.localRotation * spawnOffsetL;	break;
				case 2:			lastSpawnedTrans.localPosition += trans.localRotation * spawnOffsetR;	break;
			}
			lastSpawned.SetActive(true);
			lastSpawned.SendMessage("SetPlayer", levelSpawner.GetPlayer(), SendMessageOptions.DontRequireReceiver);
			lastSpawned.SendMessage("SetDifficultyIncrease", difficultyIncreaseModifier, SendMessageOptions.DontRequireReceiver);
			lastSpawned.GetComponent(AnimationControl).StartAnimation(spawnAnim);
			spawn1Spawner.EnemySpawned( spawnedType );
		}
	}
	
	if( nextShootTime <= 0f )
	{
		nextShootTime += shootTime * difficultyIncreaseModifier;
		
		ShootToTarget();
		targetIsP1 = (targetIsP1) ? (!player2.gameObject.activeSelf) : (player1.gameObject.activeSelf);
	}
}

function PlayerHit( delay : float )
{
	nextSpawnTime += delay;
	nextShootTime += delay;
}

private function UpdateSpeeds()
{
	if( nextSpeedUpdate <= fastestHealth )
	{
		curOmega = maxOmega;
		curCenterVel = maxCenterVel * (curCenterVel < 0f ? -1f : 1f);
		curRadiusVel = maxRadiusVel * (curRadiusVel < 0f ? -1f : 1f);
	}
	else
	{
		var fraction : float = 1f - ((1f * nextSpeedUpdate) / (1f * (startHealth - fastestHealth)));
		
		curOmega = (fraction * (maxOmega - minOmega)) + minOmega;
		curCenterVel = ((fraction * (maxCenterVel - minCenterVel)) + minCenterVel) * (curCenterVel < 0f ? -1f : 1f);
		curRadiusVel = ((fraction * (maxRadiusVel - minRadiusVel)) + minRadiusVel) * (curRadiusVel < 0f ? -1f : 1f);
	}
}

private function UpdatePosition()
{
	curTheta += curOmega * Time.deltaTime;
	if( curTheta >= Mathf.PI )
	{
		curTheta -= 2f * Mathf.PI;
	}
	
	curCenter += curCenterVel * Time.deltaTime;
	if( ((maxCenter < 0f) && (curCenter <= maxCenter)) || ((maxCenter > 0f) && (curCenter >= maxCenter)) )
	{
		if( difficulty > 0 )
		{
			if( curCenterVelX )
			{
				curCenterWidth = curCenter;
				curCenter = curCenterHeight;
				maxCenter = -curCenterHeight;
			}
			else
			{
				curCenterHeight = curCenter;
				curCenter = curCenterWidth;
				maxCenter = -curCenterWidth;
				curCenterVel *= -1f;
			}
			curCenterVelX = !curCenterVelX;
		}
		else
		{
			maxCenter *= -1f;
			curCenterVel *= -1f;
		}
	}
	
	curRadius += curRadiusVel * Time.deltaTime;
	if( ((curRadiusVel < 0f) && (curRadius <= minRadius)) || ((curRadiusVel > 0f) && (curRadius >= maxRadius)) )
	{
		curRadiusVel *= -1f;
	}

	if( curCenterVelX )
	{
		trans.localPosition.x = curCenter + (curRadius * Mathf.Cos( curTheta ));
		trans.localPosition.z = curCenterHeight + (curRadius * Mathf.Sin( curTheta ));
	}
	else
	{
		trans.localPosition.x = curCenterWidth + (curRadius * Mathf.Cos( curTheta ));
		trans.localPosition.z = curCenter + (curRadius * Mathf.Sin( curTheta ));
	}
	
	bulletMainDirection = (targetIsP1 ? player1.position : player2.position) - trans.localPosition;
	bulletMainDirection.y = 0f;
	bulletMainDirection.Normalize();
	bulletMainRotationAngle = Mathf.Atan2( bulletMainDirection.z, -bulletMainDirection.x ) * (180 / Mathf.PI);
	trans.localRotation = Quaternion.Euler( 0f, bulletMainRotationAngle, 0f);
}

private function ShootToTarget()
{
	audioSource.Play(fireSound);

	//always shoot 1 shot at the target
	FireBullet( bulletMainDirection, trans.localRotation );
	
	if( difficulty > 0 )
	{
		bulletFired = false;
		
		//choose whether to fire a bullet clockwise from the player
		if( (difficulty == 2) || (Random.Range(0,2) == 0) )
		{
			bulletSideDirection.x = (shotOffsetCos * bulletMainDirection.x) - (shotOffsetSin * bulletMainDirection.z);
			bulletSideDirection.z = (shotOffsetSin * bulletMainDirection.x) + (shotOffsetCos * bulletMainDirection.z);
			FireBullet( bulletSideDirection, Quaternion.Euler( 0f, bulletMainRotationAngle + shotRadianOffset, 0f) );
			bulletFired = true;
		}
		
		//choose whether to fire a bullet counter-clockwise from the player
		if( (difficulty == 2) || !bulletFired )
		{
			bulletSideDirection.x = (shotOffsetCos * bulletMainDirection.x) + (shotOffsetSin * bulletMainDirection.z);
			bulletSideDirection.z = (shotOffsetCos * bulletMainDirection.z) - (shotOffsetSin * bulletMainDirection.x);
			FireBullet( bulletSideDirection, Quaternion.Euler( 0f, bulletMainRotationAngle - shotRadianOffset, 0f) );
		}
	}
}

private function FireBullet( dir : Vector3, orient : Quaternion )
{
	lastBullet = bullet.Allocate();
	if( lastBullet != null )
	{
		lastBulletTrans = lastBullet.transform;
		lastBulletTrans.localPosition.x = trans.localPosition.x;
		lastBulletTrans.localPosition.z = trans.localPosition.z;
		lastBulletTrans.localRotation = orient;
		lastBullet.SetActive(true);
		lastBullet.SendMessage("SetVector", dir * difficultyIncreaseModifier * (levelSpawner.currentSpeed + bulletSpeed));
	}
}