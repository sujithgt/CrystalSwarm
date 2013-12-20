#pragma strict

var pool : PoolObject;
var lifeTime : float = 10f;

private var hasHit : boolean;
private var life : float;

function OnEnable()
{
	hasHit = false;
	life = 0f;
}

function Update()
{
	life += Time.deltaTime;
	if( life >= lifeTime )
	{
		pool.PoolRelease();
	}
}

function OnTriggerEnter( object : Collider )
{
	// layer 10 is a player bullet, don't do this for an enemy bullet hitting a player bullet since 
	// it will happen for the player bullet hitting the enemy bullet (should only go one direction)
	if( !hasHit && object.gameObject.layer != 10 )
	{
		hasHit = true;
		object.gameObject.SendMessage("EnemyCollided");
		
		pool.PoolRelease();
	}
}