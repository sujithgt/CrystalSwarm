#pragma strict

var trans : Transform;
var player : Transform;
var levelSpawner : LevelSpawner;

var minUpdateTime : float = .5f;
var maxUpdateTime : float = .8f;
var baseSpeed : float = .2f;

var speedMultiplier : float = .04f;

var rotateObject : boolean = false;

private var nextUpdate : float;
private var halfUpdate : boolean = false;

private var xVel : float;
private var zVel : float;

private var norm : float;
private var speedMult : float;
private var xDiff : float;
private var zDiff : float;

var doesSpawn : boolean = true;
private var isSpawning : boolean;
var spawnTime : float = .3f;

function OnEnable()
{
	nextUpdate = 0f;
	xVel = 0f;
	zVel = 0f;
	halfUpdate = false;
	
	if( isSpawning )
	{
		nextUpdate = spawnTime;
		UpdateRotation();
	}
}

function OnDisable()
{
	nextUpdate = 0f;
	xVel = 0f;
	zVel = 0f;

	isSpawning = doesSpawn;
}

function TestMode()
{
	baseSpeed = 0f;
	speedMultiplier = 0f;
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
		nextUpdate = Random.Range(Mathf.Max(.1f,minUpdateTime-levelSpawner.currentUpdate), Mathf.Max(.2f,maxUpdateTime-levelSpawner.currentUpdate));

		UpdateRotation();
	}
	
	trans.localPosition.x += xVel * Time.deltaTime;
	trans.localPosition.z += zVel * Time.deltaTime;
	
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
}

private function UpdateRotation()
{
	if( !player.gameObject.activeSelf )
	{ 
		player = levelSpawner.GetPlayer();
	}

	xDiff = player.localPosition.x - trans.localPosition.x;
	zDiff = player.localPosition.z - trans.localPosition.z;
	
	norm = 1f / Mathf.Sqrt((xDiff * xDiff) + (zDiff * zDiff));
	speedMult = baseSpeed + (speedMultiplier*levelSpawner.currentSpeed);

	if( halfUpdate )
	{
		if( xVel * xDiff < 0f )
		{
			xVel += speedMult * xDiff * norm;
		}
		if( zVel * zDiff < 0f )
		{
			zVel += speedMult * zDiff * norm;
		}
	}
	else
	{
		xVel += speedMult * xDiff * norm;
		zVel += speedMult * zDiff * norm;
	}

	//make them turn around faster to seem more responsive
	if( xVel * xDiff < 0f || zVel * zDiff < 0f )
	{
		nextUpdate *= .3f;
		halfUpdate = !halfUpdate;
	}
	else
	{
		halfUpdate = false;
	}

	if( rotateObject )
	{
		trans.localRotation = Quaternion.identity;
		trans.RotateAround( Vector3(0f,1f,0f), Mathf.PI/2f + Mathf.Atan2(xVel, zVel) );
	}
}
