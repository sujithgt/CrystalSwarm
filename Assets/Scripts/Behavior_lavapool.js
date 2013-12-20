#pragma strict

var scales : float[];
var frames : Mesh[];
var time : float;

var mf : MeshFilter;
var trans : Transform;

var pool : PoolObject;

private var curIndex : int;
private var curTime : float;

function OnEnable()
{
	curIndex = 0;
	curTime = time;

	trans.localScale.x = scales[curIndex];
	trans.localScale.z = scales[curIndex];
	mf.mesh = frames[curIndex];
}

function Update()
{
	curTime -= Time.deltaTime;
	
	if( curTime < 0f )
	{
		++curIndex;
		if( curIndex >= frames.Length )
		{
			pool.PoolRelease();
		}
		else
		{
			trans.localScale.x = scales[curIndex];
			trans.localScale.z = scales[curIndex];
			mf.mesh = frames[curIndex];
			
			curTime += time;
		}
	}
}

function SetTime( t : float )
{
	time = t;
	curTime = time;
}