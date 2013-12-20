#pragma strict

var levelSpawner : LevelSpawner;
var respawnTime : float = 4f;
var standingTime : float = 1.75f;
var fallingTime : float = 1f;
private var timeLeft : float;
private var visible : int;

var movement : PlayerInput;
var anim : AnimationControl;

var indicator : LivesIndicator;

var trans : Transform;
var deathRing : Transform;
var drScaleStart : float = .05f;
var drScaleEnd : float = 8f;
private var drScaleDiff : float;
private var drScaleValue : float;
var ringTime : float = .5f;

var deathSound : AudioClip;
var spawnSound : AudioClip;
var audioSource : SoundController;

function Awake()
{
	timeLeft = 2f * respawnTime;
	enabled = false;
}

function Update()
{
	//keep updating touch information even while player is dead
	if( movement.isPlayer1 && (Input.touchCount > 0 || movement.leftTouchId != -1 || movement.rightTouchId != -1) )
	{
		movement.DetectTouches();
	}

	if( timeLeft < ringTime )
	{
		drScaleValue = drScaleStart + (drScaleDiff * (timeLeft / ringTime));
		deathRing.localScale.x = drScaleValue;
		deathRing.localScale.z = drScaleValue;
	}

	if( timeLeft < fallingTime )
	{
		timeLeft += Time.deltaTime;
		if( timeLeft >= fallingTime )
		{
			anim.StartAnimation("standing");
		}
		if( timeLeft >= ringTime )
		{
			deathRing.gameObject.SetActive(false);
		}
	}
	else if( timeLeft < standingTime )
	{
		timeLeft += Time.deltaTime;
		if( timeLeft >= standingTime )
		{
			movement.enabled = true;
			audioSource.Play(spawnSound);
		}
	}
	else if( timeLeft < respawnTime )
	{
		timeLeft += Time.deltaTime;
		if( timeLeft >= respawnTime )
		{
			renderer.enabled = true;
			enabled = false;
		}
		else
		{
			visible = timeLeft * 8f;
			renderer.enabled = (visible % 2) == 0;
		}
	}
}

function SpawnPlayer()
{
	enabled = true;
	timeLeft = standingTime + .01f;
}

function EnemyCollided()
{
	if( timeLeft >= respawnTime )
	{
		audioSource.Play(deathSound);

		timeLeft = 0;
		enabled = true;
		levelSpawner.PlayerHit(standingTime);
		indicator.LoseLife( fallingTime );
		
		movement.enabled = false;
		anim.SetReverse(false);
		anim.StartAnimation("falling");
		
		deathRing.gameObject.SetActive(true);
		deathRing.localPosition.x = trans.localPosition.x;
		deathRing.localPosition.z = trans.localPosition.z;
		drScaleDiff = drScaleEnd - drScaleStart;
		deathRing.localScale.x = drScaleStart;
		deathRing.localScale.z = drScaleStart;
	}
}

function EnemyCollided( unused : Object )
{
	EnemyCollided();
}