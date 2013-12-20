#pragma strict

var trans : Transform;
var player : Transform;
var speed : float;
var levelSpawner : LevelSpawner;
var speedMultiplier : float;

var changeOnDifficulty : boolean = false;

var initializeTowardsPlayer : boolean = false;

var rotateObject : boolean = false;

var turnSpeed : float = Mathf.PI / 2f;
var update : float = .1f;
private var nextUpdate : float;

private var turnSin : float;
private var turnCos : float;

private var curSin : float;
private var curCos : float;

private var xVel : float;
private var zVel : float;

private var posXVel : float;
private var posZVel : float;

private var negXVel : float;
private var negZVel : float;

private var xDiff : float;
private var zDiff : float;

var doesSpawn : boolean = true;
private var isSpawning : boolean;
var spawnTime : float = .3f;

function Awake()
{
	if( changeOnDifficulty )
	{
		//difficulty modifier is too much here, just use half
		turnSpeed *= ((1f + levelSpawner.difficultyDecreaseModifier) * .5f);
	}

	turnSin = Mathf.Sin(turnSpeed * update);
	turnCos = Mathf.Cos(turnSpeed * update);
}

function OnDisable()
{
	isSpawning = doesSpawn;
}

function OnEnable()
{
	nextUpdate = 0f;
	if( isSpawning )
	{
		nextUpdate = spawnTime;
	}
}

function TestMode()
{
	speed = 0f;
	speedMultiplier = 0f;
}

function Update ()
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
		nextUpdate += update;
		
		if( !player.gameObject.activeSelf )
		{
			player = levelSpawner.GetPlayer();
		}
		
		if( player != null )
		{
			xDiff = player.localPosition.x - trans.localPosition.x;
			zDiff = player.localPosition.z - trans.localPosition.z;
			
			posXVel = (curCos * turnCos) - (curSin * turnSin);
			posZVel = (curSin * turnCos) + (curCos * turnSin);
			
			negXVel = (curCos * turnCos) + (curSin * turnSin);
			negZVel = (curSin * turnCos) - (curCos * turnSin);
			
			// if toPlayer.posDirection > toPlayer.negDirection the posDirection is closer to
			//   towards the player than negDirection
			if( (xDiff * posXVel + zDiff * posZVel) > (xDiff * negXVel + zDiff * negZVel) )
			{
				xVel = posXVel;
				zVel = posZVel;
			}
			else
			{
				xVel = negXVel;
				zVel = negZVel;
			}
			
			curCos = xVel;
			curSin = zVel;
		
			if( rotateObject )
			{
				trans.localRotation = Quaternion.identity;
				trans.RotateAround( Vector3(0f,1f,0f), Mathf.PI/2f + Mathf.Atan2(xVel, zVel) );
			}
		}
	}
	
	trans.localPosition.x += xVel * (speed + ((levelSpawner != null) ? (levelSpawner.currentSpeed * speedMultiplier) : 0f)) * Time.deltaTime;
	trans.localPosition.z += zVel * (speed + ((levelSpawner != null) ? (levelSpawner.currentSpeed * speedMultiplier) : 0f)) * Time.deltaTime;
	
	if( trans.localPosition.x < -Globals.levelxBounds )
	{
		trans.localPosition.x = -Globals.levelxBounds;
	}
	else if( trans.localPosition.x > Globals.levelxBounds )
	{
		trans.localPosition.x = Globals.levelxBounds;
	}
	
	if( trans.localPosition.z < -Globals.levelzBounds )
	{
		trans.localPosition.z = -Globals.levelzBounds;
	}
	else if( trans.localPosition.z > Globals.levelzBounds )
	{
		trans.localPosition.z = Globals.levelzBounds;
	}
}

function SetPlayer( pl : Transform )
{
	player = pl;
	if( initializeTowardsPlayer )
	{
		xVel = player.localPosition.x - trans.localPosition.x;
		zVel = player.localPosition.z - trans.localPosition.z;
		
		var normalizer : float = Mathf.Sqrt( (xVel * xVel) + (zVel * zVel) );
		
		xVel /= normalizer;
		zVel /= normalizer;
		curCos = xVel;
		curSin = zVel;
	}
}

function SetVelocity( vel : Vector3 )
{
	trans.localRotation = Globals.axisRotations[vel.x];
	xVel = Globals.axisVectors[vel.x].x;
	zVel = Globals.axisVectors[vel.x].z;
	speed = vel.y;
	curCos = xVel;
	curSin = zVel;
}
