#pragma strict

var mf : MeshFilter;
var mr : MeshRenderer;
var trans : Transform;
var defaultAnimName : String = "default";

private var initialized : boolean = false;

private var animList : AnimationLabel[];
private var defaultAnim : AnimationLabel;

var curAnim : AnimationLabel;
private var frameIndex : int;
private var frameTime : float;
private var curTime : float;

var mapDependent : boolean = false;
var mapControl : BackgroundController;

private var inReverse : boolean = false;

var pool : PoolObject;

function Initialize()
{
	initialized = true;
	inReverse = false;

	var list : Array = this.gameObject.GetComponents(AnimationLabel);
	var i : int;

	animList = new AnimationLabel[list.length];
	for( i = 0 ; i < list.length ; ++i )
	{
		animList[i] = list[i];
		if( animList[i].animName == defaultAnimName )
		{
			defaultAnim = animList[i];
		}
	}
}

function OnEnable()
{
	if( !initialized )
	{
		Initialize();
	}

	StartDefaultAnimation();
}

function Update()
{
	curTime += Time.deltaTime;
	
	if( curTime >= frameTime )
	{
		curTime -= frameTime;

		frameIndex += (inReverse ? -1 : 1);
		if( (mapDependent ? (frameIndex == curAnim.framesPerMap) : (frameIndex == curAnim.frames.Length)) || frameIndex == -1 )
		{
			if( curAnim.loop )
			{
				frameIndex = (inReverse ? (mapDependent ? (curAnim.framesPerMap - 1) : (curAnim.frames.Length - 1)) : 0);
			}
			else if( curAnim.destroyOnFinish )
			{
				pool.PoolRelease();
				return;
			}
			else if( curAnim.nextAnimName.Length > 0 )
			{
				StartAnimation( curAnim.nextAnimName );
			}
			else
			{
				StartDefaultAnimation();
			}
		}
		
		mf.mesh = curAnim.frames[(mapDependent ? mapControl.currentBackground * curAnim.framesPerMap : 0) + frameIndex];
		if( curAnim.rescale )
		{
			trans.localScale.x = curAnim.frameScale[frameIndex];
			trans.localScale.z = curAnim.frameScale[frameIndex];
		}
	}
}

function StartDefaultAnimation()
{
	curAnim = defaultAnim;
	frameTime = curAnim.time;
	
	PlayAnim();
}

function ResumeAnimation( name : String )
{
	if( curAnim.animName != name )
	{
		StartAnimation( name );
	}
}

function StartAnimation( name : String )
{
	if( !initialized )
	{
		Initialize();
	}

	var i : int = 0;
	
	while( animList[i].animName != name )
	{
		++i;
	}
	
	curAnim = animList[i];
	frameTime = curAnim.time;
	
	PlayAnim();
}

function StartAnimation( name : String, totalTime : float )
{
	if( !initialized )
	{
		Initialize();
	}

	var i : int = 0;
	while( animList[i].animName != name )
	{
		++i;
	}
	
	curAnim = animList[i];
	frameTime = totalTime / curAnim.frames.Length;
	
	PlayAnim();
}

function SetReverse( rev : boolean )
{
	inReverse = rev;
}

private function PlayAnim()
{
	frameIndex = (inReverse ? (mapDependent ? (curAnim.framesPerMap-1) : (curAnim.frames.Length-1)) : 0);
	mf.mesh = curAnim.frames[frameIndex];

	if( mr != null && curAnim.mat != null )
	{
		mr.material = curAnim.mat;
	}

	if( curAnim.rescale )
	{
		trans.localScale.x = curAnim.frameScale[frameIndex];
		trans.localScale.z = curAnim.frameScale[frameIndex];
	}
	
	curTime = 0f;
}
