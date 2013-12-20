#pragma strict

//general variables
private var difficulty : int;
private var difficultyIncreaseModifier : float;
private var difficultyDecreaseModifier : float;

var trans : Transform;
var levelSpawner : LevelSpawner;

var health : EnemyHealth;
var healthBarManager : HealthBarManager;
private var healthBarIndex : int = -1;

//spawn and behavior control variables
var wave : int = 0;
var movement : Behavior_gridmovement;

var spawnPool : EnemyPool;

var currentWaveOther : Behavior_scorpionboss;

var nextWaveLeft : GameObject;
var nextWaveRight : GameObject;

var anim : AnimationControl;

//lava trail variables
var lava : EnemyPool;
private var lastLava : GameObject;
private var lastLavaTrans : Transform;

var lavaTime : float = .75f;
private var nextLavaTime : float;
var lavaGroundTime : float = 3f;

//shooting variables
var bullet : EnemyPool;
private var lastBullet : GameObject;
private var lastBulletTrans : Transform;

var shootTime : float = .7f;
var bulletSpeed : float = 2f;
var speedMultiplier : float = .2f;
private var nextShootTime : float;

var fireSound : AudioClip;
var audioSource : SoundController;

function OnEnable()
{
	difficulty = levelSpawner.difficulty;
	difficultyIncreaseModifier = levelSpawner.difficultyIncreaseModifier;
	difficultyDecreaseModifier = levelSpawner.difficultyDecreaseModifier;
	
	nextShootTime = shootTime * difficultyIncreaseModifier;
	nextLavaTime = lavaTime * difficultyIncreaseModifier;

	collider.enabled = false;

	if( wave == 0 )
	{
		this.gameObject.SendMessage("SetEntranceSide", levelSpawner.GetPlayer().transform.localPosition.x > 0);
		this.gameObject.SendMessage("ClearTurnDirection");
		anim.StartAnimation("rise");
	}
}

function OnDisable()
{
	if( wave == 1 && difficulty > 1 && (currentWaveOther != null) && currentWaveOther.gameObject.activeSelf && (currentWaveOther.wave == wave) )
	{
		if( movement.turnLeftOnly && nextWaveRight != null )
		{
			nextWaveRight.SendMessage("SetTurnDirection", true);
		}
		if( !movement.turnLeftOnly && nextWaveLeft != null )
		{
			nextWaveLeft.SendMessage("SetTurnDirection", false);
		}
	}

	healthBarManager.PauseUpdates();

	if( healthBarIndex >= 0 )
	{
		healthBarManager.ReleaseHealthBar(healthBarIndex);
		healthBarIndex = -1;
	}

	if( wave == 0 || wave == 1 )
	{
		if( nextWaveLeft != null )
		{
			nextWaveLeft.SendMessage("StartEntering", null, SendMessageOptions.DontRequireReceiver);
		}
		if( nextWaveRight != null )
		{
			nextWaveRight.SendMessage("StartEntering", null, SendMessageOptions.DontRequireReceiver);
		}
	}
	
	healthBarManager.ResumeUpdates();

	wave = 0;
}

function TestMode()
{
	nextLavaTime = 1000000f;
	nextShootTime = 1000000f;
}

function Update()
{
	if( wave == 0 && !movement.hasEntered && !movement.isEntering)
	{
		this.gameObject.SendMessage("StartEntering");
	}

	nextShootTime -= Time.deltaTime;
	
	if( nextShootTime <= 0 )
	{
		audioSource.Play(fireSound);

		lastBullet = bullet.Allocate();
		if( lastBullet != null )
		{
			lastBulletTrans = lastBullet.transform;
			lastBulletTrans.localPosition.x = trans.localPosition.x;
			lastBulletTrans.localPosition.z = trans.localPosition.z;
			lastBullet.SetActive(true);
			lastBullet.SendMessage("SetVelocity", Vector3(movement.currentDirection, bulletSpeed + (movement.currentSpeed * speedMultiplier), 0f));
			lastBullet.SendMessage("SetPlayer", movement.hasEntered ? movement.player : levelSpawner.GetPlayer());
		}

		nextShootTime += shootTime * difficultyIncreaseModifier;
	}
	

	if( movement.hasEntered )
	{
		nextLavaTime -= Time.deltaTime;
		if( nextLavaTime <= 0 )
		{
			lastLava = lava.Allocate();
			if( lastLava != null )
			{
				lastLavaTrans = lastLava.transform;
				lastLavaTrans.localPosition.x = trans.localPosition.x;
				lastLavaTrans.localPosition.z = trans.localPosition.z;
				lastLava.SetActive(true);
				lastLava.SendMessage("SetTime", lavaGroundTime * difficultyDecreaseModifier);
			}
			else
			{
				Debug.LogError("Ran out of lava objects");
			}
			
			nextLavaTime += lavaTime * difficultyIncreaseModifier;
		}
	}
}

function SetWave( wv : int )
{
	wave = wv;
}

function SetWavePartner( obj : GameObject )
{
	currentWaveOther = obj.GetComponent(Behavior_scorpionboss);
}

function SetNextWaveLeft( obj : GameObject )
{
	nextWaveLeft = obj;
}

function SetNextWaveRight( obj : GameObject )
{
	nextWaveRight = obj;
}

function StartEntering()
{
	if( !movement.hasEntered )
	{
		anim.StartAnimation("rise");
		collider.enabled = true;
		
		if( movement.leftSideEntrance )
		{
			healthBarIndex = healthBarManager.RequestHealthBar(health, HEALTHBARSIDES.HB_LEFT);
		}
		else
		{
			healthBarIndex = healthBarManager.RequestHealthBar(health, HEALTHBARSIDES.HB_RIGHT);
		}
	}
}

function FinishedEntering()
{
	nextLavaTime = lavaTime * difficultyIncreaseModifier;

	if( wave == 0 )
	{
		nextWaveLeft = spawnPool.Allocate();
		nextWaveRight = spawnPool.Allocate();
		
		nextWaveLeft.GetComponent(Behavior_scorpionboss).SetWave(1);
		nextWaveLeft.SetActive(true);
		nextWaveLeft.SendMessage("SetEntranceSide", true);
		nextWaveLeft.SendMessage("SetTurnDirection", false);
		nextWaveLeft.SendMessage("SetWavePartner", nextWaveRight);
		
		nextWaveRight.GetComponent(Behavior_scorpionboss).SetWave(1);
		nextWaveRight.SetActive(true);
		nextWaveRight.SendMessage("SetEntranceSide", false);
		nextWaveRight.SendMessage("SetTurnDirection", true);
		nextWaveRight.SendMessage("SetWavePartner", nextWaveLeft);
		
		levelSpawner.EnemySpawned(Globals.EN_BOSS_SCORPION);
		levelSpawner.EnemySpawned(Globals.EN_BOSS_SCORPION);
	}
	if( wave == 1 && difficulty > 0 && movement.leftSideEntrance )
	{
		var onLeft : boolean = movement.player.localPosition.x > 0;
		
		if( onLeft || difficulty > 1 )
		{
			nextWaveLeft = spawnPool.Allocate();
			nextWaveLeft.GetComponent(Behavior_scorpionboss).SetWave(2);
			nextWaveLeft.SetActive(true);
			nextWaveLeft.SendMessage("SetEntranceSide", true);
			nextWaveLeft.SendMessage("ClearTurnDirection");
			levelSpawner.EnemySpawned(Globals.EN_BOSS_SCORPION);
		}
		if( !onLeft || difficulty > 1 )
		{
			nextWaveRight = spawnPool.Allocate();
			nextWaveRight.GetComponent(Behavior_scorpionboss).SetWave(2);
			nextWaveRight.SetActive(true);
			nextWaveRight.SendMessage("SetEntranceSide", false);
			nextWaveRight.SendMessage("ClearTurnDirection");
			levelSpawner.EnemySpawned(Globals.EN_BOSS_SCORPION);
		}
		if( difficulty > 1 )
		{
			nextWaveLeft.SendMessage("SetWavePartner", nextWaveRight);
			nextWaveRight.SendMessage("SetWavePartner", nextWaveLeft);
		}
		
		currentWaveOther.SendMessage("SetNextWaveLeft", nextWaveLeft );
		currentWaveOther.SendMessage("SetNextWaveRight", nextWaveRight );
	}
}

function PlayerHit( delay : float )
{
	nextShootTime += delay;
	nextLavaTime += delay;
}
