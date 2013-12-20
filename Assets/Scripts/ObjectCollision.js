#pragma strict

var collisionMessage : String = "EnemyCollided";

var powerupCheck : boolean;
var powerupType : int;

var destroyOnCollision : boolean = false;

var pool : PoolObject;

//var audioSource : AudioSource;
//var collisionSound : AudioClip;

function Awake()
{
	enabled = false;
}

function OnTriggerEnter(object : Collider)
{
	//don't destroy other powerups if the player already has one
	if( powerupCheck && object.GetComponent(PlayerInput).HasPowerup(powerupType) )
	{
		return;
	}

	//audioSource.PlayOneShot(collisionSound);
	if( object != null )
	{
		object.SendMessage(collisionMessage, null, SendMessageOptions.DontRequireReceiver);
	}
	
	if( destroyOnCollision && (object.gameObject.layer != 10) )
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
