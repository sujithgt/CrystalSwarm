#pragma strict

var trans : Transform;

private var velocity : Vector3;
private var direction : int;
private var speed : float;
var pool : PoolObject;

var bounce : boolean = false;
private var hasBounced : boolean;

function OnEnable()
{
	velocity = Vector3.zero;
	hasBounced = false;
}

function Update()
{
	trans.localPosition += velocity * Time.deltaTime;
	
	if( bounce && !hasBounced )
	{
		if( trans.localPosition.x < -Globals.levelxBounds )
		{
			direction = (12 - direction) % 8;
			trans.localRotation = Globals.axisRotations[direction];
			velocity = Globals.axisVectors[direction];
			velocity *= speed;
			
			trans.localPosition.x = -Globals.levelxBounds;
			hasBounced = true;
		}
		if( trans.localPosition.x > Globals.levelxBounds )
		{
			direction = (12 - direction) % 8;
			trans.localRotation = Globals.axisRotations[direction];
			velocity = Globals.axisVectors[direction];
			velocity *= speed;
			
			trans.localPosition.x = Globals.levelxBounds;
			hasBounced = true;
		}
		if( trans.localPosition.z < -Globals.levelzBounds )
		{
			direction = 8 - direction;
			trans.localRotation = Globals.axisRotations[direction];
			velocity = Globals.axisVectors[direction];
			velocity *= speed;

			trans.localPosition.z = -Globals.levelzBounds;
			hasBounced = true;
		}
		if( trans.localPosition.z > Globals.levelzBounds )
		{
			direction = 8 - direction;
			trans.localRotation = Globals.axisRotations[direction];
			velocity = Globals.axisVectors[direction];
			velocity *= speed;

			trans.localPosition.z = Globals.levelzBounds;
			hasBounced = true;
		}
	}
	else
	{
		if( trans.localPosition.x < -Globals.levelxBounds || 
			trans.localPosition.x > Globals.levelxBounds || 
			trans.localPosition.z < -Globals.levelzBounds || 
			trans.localPosition.z > Globals.levelzBounds )
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
	}
}

function SetVelocity( vel : Vector3 )
{
	direction = vel.x;
	trans.localRotation = Globals.axisRotations[direction];
	velocity = Globals.axisVectors[direction];
	speed = vel.y;
	velocity *= speed;
}

function SetVector( vel : Vector3 )
{
	velocity = vel;
}
