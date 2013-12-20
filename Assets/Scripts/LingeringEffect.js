#pragma strict

var mf : MeshFilter;

var frames : Mesh[];
var frameTimeMin : float;
var frameTimeMax : float;
private var frameTimeDifference : float;

private var curFrame : int;
private var curTime : float;
private var curFrameTime : float;

var pool : PoolObject;

function Awake()
{
	frameTimeDifference = frameTimeMax - frameTimeMin;
}

function OnEnable()
{
	curFrame = 0;
	curFrameTime = frameTimeMin + (frameTimeDifference * Random.Range(0f,1f));
	curTime = curFrameTime;
	
	mf.mesh = frames[curFrame];
}

function Update()
{
	curTime -= Time.deltaTime;
	if( curTime < 0f )
	{
		curTime += curFrameTime;
		++curFrame;
		if( curFrame < frames.Length )
		{
			mf.mesh = frames[curFrame];
		}
		else
		{
			pool.PoolRelease();
		}
	}
}