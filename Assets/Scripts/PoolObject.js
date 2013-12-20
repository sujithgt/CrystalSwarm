#pragma strict

var index : int;
var pool : EnemyPool;

var ps : ParticleSystem;

var allocated : boolean = false;

function PoolRelease()
{
	if( ps != null )
	{
		ps.Clear();
	}

	if( allocated )
	{
		gameObject.SetActive(false);
		pool.Release( index );
		allocated = false;
	}
}
