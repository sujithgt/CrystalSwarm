#pragma strict

var volumeMultiplier : float = .6f;

var sourceNum : int = 5;
var sources : AudioSource[];
private var curSource : int;

private var muted : boolean;

function Awake()
{
	for( curSource = 0 ; curSource < sourceNum ; ++curSource )
	{
		sources[curSource].volume = Globals.GetSoundVolume() * volumeMultiplier;
		sources[curSource].bypassEffects = true;
		sources[curSource].loop = false;
		sources[curSource].priority = 1;
	}
	
	if( Globals.GetSoundVolume() < .01f )
	{
		muted = true;
	}
	
	curSource = 0;
}

function Play( clip : AudioClip )
{
	if( !muted )
	{
		if( sources[curSource].isPlaying )
		{
			sources[curSource].Stop();
		}
	
		sources[curSource].clip = clip;
		sources[curSource].Play();
		
		++curSource;
		if( curSource == sourceNum )
		{
			curSource = 0;
		}
	}
}
