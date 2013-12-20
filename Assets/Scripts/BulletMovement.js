#pragma strict

var trans : Transform;

var hasHit : boolean = false;
private var direction : int;
private var speed : float;
private var player : float;
private var velocity : Vector3;

var playerSpecific : boolean = false;
var mf : MeshFilter;
var p1Mesh : Mesh;
var p2Mesh : Mesh;

var collisionMessage : String = "BulletCollided";

var pool : PoolObject;

function OnEnable()
{
	hasHit = false;
}

function Update()
{
	trans.localPosition += velocity * Time.deltaTime;
	
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

function SetVelocity( vel : Vector3 )
{
	direction = vel.x;
	speed = vel.y;
	player = vel.z;
	
	if( playerSpecific )
	{
		if( player == 1f )
		{
			mf.mesh = p1Mesh;
		}
		else
		{
			mf.mesh = p2Mesh;
		}
	}

	trans.localRotation = Globals.axisRotations[direction];
	velocity = Globals.axisVectors[direction] * speed;
}

function OnTriggerEnter( object : Collider )
{
	// layer 10 is a player bullet, don't do this for an enemy bullet hitting a player bullet since 
	// it will happen for the player bullet hitting the enemy bullet (should only go one direction)
	if( !hasHit && object.gameObject.layer != 10 )
	{
		hasHit = true;
		object.gameObject.SendMessage(collisionMessage, Vector3(direction, speed, player), SendMessageOptions.DontRequireReceiver);
		
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