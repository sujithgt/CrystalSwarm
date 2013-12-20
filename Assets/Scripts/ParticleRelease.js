#pragma strict

var releaseAfterTime : float;
private var curTime : float;

var pool : PoolObject;

function Start()
{
	curTime = releaseAfterTime;
}

function OnDisable()
{
	curTime = releaseAfterTime;
}

function Update()
{
	curTime -= Time.deltaTime;
	if( curTime <= 0f )
	{
		pool.PoolRelease();
	}
}