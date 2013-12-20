#pragma strict

var trans : Transform;
var health : int = 1;
var curHealth : int;

private var healthf : float;

var knockBack : float = .1f;

var reportDeath : boolean = true;
var myType : int = Globals.EN_NORM1;
var levelSpawner : LevelSpawner;
var normalSpawner : NormalEnemySpawner;

var player1Score : PlayerScore;
var player2Score : PlayerScore;

var points : int = 0;
var pointOnHit : int = 0;

var hitSound1 : AudioClip;
var hitSound2 : AudioClip;
var deathSound1 : AudioClip;
var deathSound2 : AudioClip;
var audioSource : SoundController;

private var hitSoundChoice : boolean;
private var deathSoundChoice : boolean;

var pool : PoolObject;

var anim : AnimationControl;
var animName : String;

var move8way : Behavior_8wayrandom;
var moveHoming : Behavior_homing;
var shoot : Behavior_shoot;
var spawn : Behavior_spawn;
var boss_bee : Behavior_beeboss;
var boss_scorpion : Behavior_scorpionboss;
var boss_grid : Behavior_gridmovement;

private var needsReenable : boolean = false;

var particle : EnemyPool;
private var lastParticle : GameObject;
private var lastParticleTrans : Transform;

var spatter : EnemyPool;
private var lastSpatter : GameObject;
private var lastSpatterTrans : Transform;

function Awake()
{
	curHealth = health;
	healthf = health;
	
	hitSoundChoice = (hitSound2 != null);
	deathSoundChoice = (deathSound2 != null);
}

function OnDisable()
{
	curHealth = health;
	healthf = health;
	
	if( needsReenable )
	{
		needsReenable = false;
		ToggleEnable( true );
	}
}

function BulletCollided( vel : Vector3 )
{
	trans.localPosition += Globals.axisVectors[vel.x] * vel.y * knockBack;
	if( curHealth > 0 )
	{
		--curHealth;

		if( curHealth == 0 )
		{
			audioSource.Play( (deathSoundChoice && (Random.Range(0,2)==0)) ? deathSound2 : deathSound1);
		
			if( vel.z == 1f )
			{
				player1Score.AddPoints( points );
			}
			else if( vel.z == 2f )
			{
				player2Score.AddPoints( points );
			}

			if( reportDeath )
			{
				if( normalSpawner != null )
				{
					normalSpawner.EnemyDestroyed( myType );
				}
				else
				{
					levelSpawner.EnemyDestroyed( myType );
				}
			}
			/* test taking out blood spatter on death
			if( spatter != null )
			{
				lastSpatter = spatter.Allocate();
				if( lastSpatter != null )
				{
					lastSpatterTrans = lastSpatter.transform;
					lastSpatterTrans.localPosition.x = trans.localPosition.x;
					lastSpatterTrans.localPosition.z = trans.localPosition.z;
					lastSpatterTrans.localRotation = Globals.axisRotations[(vel.x + 4) % 8];
					lastSpatter.SetActive(true);
				}
			}
			*/
			if( anim == null )
			{
				if( pool != null )
				{
					pool.PoolRelease();
				}
				else
				{
					Destroy( this.gameObject );
				}
			}
			else
			{
				needsReenable = true;
				ToggleEnable(false);
				anim.StartAnimation(animName);
			}
		}
	}
	if( curHealth != 0 )
	{
		audioSource.Play( (hitSoundChoice && (Random.Range(0,2)==0)) ? hitSound2 : hitSound1);
		if( vel.z == 1f )
		{
			player1Score.AddPoints( pointOnHit );
		}
		else if( vel.z == 2f )
		{
			player2Score.AddPoints( pointOnHit );
		}
	}

	if( particle != null )
	{
		lastParticle = particle.Allocate();
		if( lastParticle )
		{
			lastParticleTrans = lastParticle.transform;
			lastParticleTrans.localPosition.x = trans.localPosition.x;
			lastParticleTrans.localPosition.z = trans.localPosition.z;
			lastParticleTrans.localRotation = Globals.axisRotations[vel.x];
			lastParticle.SetActive(true);
		}
	}
}

function Percentage() : float
{
	return (1f * curHealth) / healthf;
}

private function ToggleEnable( toggle : boolean )
{
	if( collider )
	{
		collider.enabled = toggle;
	}

	if( move8way != null )
	{
		move8way.enabled = toggle;
	}
	if( moveHoming != null )
	{
		moveHoming.enabled = toggle;
	}
	if( shoot != null )
	{
		shoot.enabled = toggle;
	}
	if( spawn != null )
	{
		spawn.enabled = toggle;
	}
	if( boss_bee != null )
	{
		boss_bee.enabled = toggle;
	}
	if( boss_scorpion != null )
	{
		boss_scorpion.enabled = toggle;
	}
	if( boss_grid != null )
	{
		boss_grid.enabled = toggle;
	}
}