#pragma strict

var trans : Transform;
var player : Transform;
var levelSpawner : LevelSpawner;

var minUpdateTime : float = 1f;
var maxUpdateTime : float = 2f;
var baseSpeed : float = 1f;

var speedMultiplier : float = 1f;
var randomize : boolean = true;
var fullRandom : boolean = false;
var stayCentered : boolean = false;

private var nextUpdate : float = 0f;

private var xDiff : float;
private var zDiff : float;
private var slope : float;

var vel : Vector3;
var dir : int;

var getSpawnDirection : boolean = false;
var doesSpawn : boolean = true;
private var isSpawning : boolean;
var spawnTime : float = .3f;

function OnDisable()
{
	isSpawning = doesSpawn;
}

function OnEnable()
{
	nextUpdate = 0f;
	vel = Vector3.zero;

	if( isSpawning && getSpawnDirection )
	{
		FindDirection();
		nextUpdate = spawnTime;
	}
}

function TestMode()
{
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
		nextUpdate = Random.Range(Mathf.Max(.2f,minUpdateTime-levelSpawner.currentUpdate), Mathf.Max(.4f,maxUpdateTime-levelSpawner.currentUpdate));

		FindDirection();
	}
	
	trans.localPosition += vel * (baseSpeed + levelSpawner.currentSpeed) * Time.deltaTime;
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

private function FindDirection()
{
	var tempx : int = 0;
	var tempz : int = 0;

	if( fullRandom )
	{
		while( tempx == 0 && tempz == 0 )
		{
			tempx = Random.Range(-1,2);
			tempz = Random.Range(-1,2);
		}
	}
	else if( stayCentered )
	{
		tempx = Random.Range(-1,3);
		tempz = Random.Range(-1,3);
		if( tempx == 0 && tempz == 0 )
		{
			tempx = (trans.localPosition.x < 0) ? 1 : -1;
			tempz = (trans.localPosition.z < 0) ? 1 : -1;
		}
		if( tempx == 2 )
		{
			tempx = (trans.localPosition.x < 0) ? 1 : -1;
		}
		if( tempz == 2 )
		{
			tempz = (trans.localPosition.z < 0) ? 1 : -1;
		}
	}
	else
	{
		if( !player.gameObject.activeSelf )
		{
			player = levelSpawner.GetPlayer();
		}
		
		xDiff = player.localPosition.x - trans.localPosition.x;
		zDiff = player.localPosition.z - trans.localPosition.z;
		//only using slope to determine if movement should be diagonal or not, don't need it to be accurate just outside of [.5f,2f]
		slope = (xDiff != 0f) ? Mathf.Abs(zDiff / xDiff) : 3f;

		
		//if this is true, moving diagonally will bring this enemy closest to the player
		if( (slope >= .5f) && (slope <= 2f) )
		{
			if( randomize )
			{
				tempx = Random.Range(0,2);
				tempz = Random.Range(0,2);
				if( tempx == 0 && tempz == 0 )
				{
					tempx = 1;
					tempz = 1;
				}
			}
			else
			{
				tempx = 1;
				tempz = 1;
			}
			tempx *= (xDiff > 0 ? 1 : -1);
			tempz *= (zDiff > 0 ? 1 : -1);
		}
		//otherwise check to see if the movement should be more along z
		else if( Mathf.Abs(zDiff) > Mathf.Abs(xDiff) )
		{
			tempx = randomize ? Random.Range(-1,3) : 0;
			tempz = (zDiff > 0f) ? 1 : -1;
			if( tempx == 2 )
			{
				tempx = 0;
			}
		}
		//otherwise the movement should be more along x
		else
		{
			tempx = (xDiff > 0f) ? 1 : -1;
			tempz = randomize ? Random.Range(-1,3) : 0;
			if( tempz == 2 )
			{
				tempz = 0;
			}
		}
	}
	
	vel.x = tempx * speedMultiplier;
	vel.z = tempz * speedMultiplier;
	dir = Globals.GetDirectionValue(tempx, tempz);
	trans.localRotation = Globals.axisRotations[dir];
	
	if( tempx != 0 && tempz != 0 )
	{
		vel *= Globals.recipSqrt2;
	}
}