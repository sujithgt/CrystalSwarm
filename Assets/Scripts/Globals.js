#pragma strict

// game information
static final var MAX_WAVES : int = 60;

static final var RATING_TIME_BASE : float = 200f;
static final var RATING_TIME_INCREMENT : float = 4f;

static final var RATING_1_OFFSET : float = -150f;
static final var RATING_2_OFFSET : float = -75f;
static final var RATING_3_OFFSET : float = 0f;

static final var TIER_SIZE : int = 10;	// it is assumed that this is double the
						// row size in the details screen in the main menu
static final var TIER_REQUIREMENT /*: int[][]*/ = [ [ 0, 3,  9, 21, 36, 54 ],
													[ 0, 5, 15, 30, 50, 75 ],
													[ 0, 5, 15, 30, 50, 100] ];



// enemy information
static final var EN_INVUL1 : int = 0;
static final var EN_INVUL2 : int = 1;
static final var EN_INVUL3 : int = 2;
static final var EN_INVUL4 : int = 3;

static final var EN_MINE1 : int = 4;
static final var EN_MINE2 : int = 5;
static final var EN_MINE3 : int = 6;
static final var EN_MINE4 : int = 7;

static final var EN_NORM1 : int = 8;
static final var EN_NORM2 : int = 9;
static final var EN_NORM3 : int = 10;
static final var EN_NORM4 : int = 11;

static final var EN_SPAWN1 : int = 12;
static final var EN_SPAWN2 : int = 13;
static final var EN_SPAWN3 : int = 14;
static final var EN_SPAWN4 : int = 15;

static final var EN_SPAWNED1 : int = 16;
static final var EN_SPAWNED2 : int = 17;
static final var EN_SPAWNED3 : int = 18;
static final var EN_SPAWNED4 : int = 19;

static final var EN_BOSS_BEE : int = 20;

static final var EN_POWERUP_DOUBLE : int = 21;
static final var EN_POWERUP_TRIPLE : int = 22;
static final var EN_POWERUP_OTHER1 : int = 23;
static final var EN_POWERUP_OTHER2 : int = 24;
static final var EN_POWERUP_OTHER3 : int = 25;
static final var EN_POWERUP_OTHER4 : int = 26;
static final var EN_POWERUP_OTHER5 : int = 27;
static final var EN_POWERUP_OTHER6 : int = 28;

static final var EN_HOMING1 : int = 29;
static final var EN_HOMING2 : int = 30;
static final var EN_HOMING3 : int = 31;
static final var EN_HOMING4 : int = 32;

static final var EN_MINER1 : int = 33;
static final var EN_MINER2 : int = 34;
static final var EN_MINER3 : int = 35;
static final var EN_MINER4 : int = 36;

static final var EN_BOSS_SCORPION : int = 37;
static final var EN_BOSS_BLOCKER : int = 38;

static final var EN_END : int = 39;

// these can't be spawned, but should be reserved a type
static final var EN_BULLET : int = 100;
static final var EN_BULLET_HOMING : int = 101;
static final var EN_SCORPION_LAVAPOOL : int = 102;

// spawning helper class
static final var TYPE_CLEAR : int = 0;
static final var TYPE_SPAWN : int = 1;
static final var TYPE_SCREEN : int = 2;
static final var TYPE_COUNT : int = 3;
static final var TYPE_BLANK : int = 4;
static final var TYPE_CUTSCENE : int = 5;
static final var TYPE_EXIT : int = 6;

static final var CUTSCENE_LIST : String[] = [
	"CrystalSwarm_CS1.m4v",
	"CrystalSwarm_CS2.m4v",
	"CrystalSwarm_CS3.m4v" ];//,
	//"CrystalSwarm_CS4.m4v" ];

class SpawnEq
{
	private var a : float;
	private var b : float;
	private var c : float;
	private var d : float;
	
	var type : int;
	var enemy : int;
	
	var wave : int;
	var pause : boolean;
	
	function SpawnEq( owave : int, opause : boolean, otype : int, oenemy : int, oa : float, ob : float, oc : float, od : float )
	{
		a = oa;
		b = ob;
		c = oc;
		d = od;
		type = otype;
		enemy = oenemy;
		wave = owave;
		pause = opause;
	}
	
	final function Value( owave : int ) : int
	{
		var result : int;

		if( owave % 2 == 0 )
		{
			result = .1f + ((a + c) * owave) + b + d;
		}
		else
		{
			result = .1f + (a * owave) + b;
		}
		
		return (result >= 0) ? result : 0;
	}
}

// sound and preference information
static var musicVolume : int = 5;
static var soundVolume : int = 5;

static var dataInitialized : boolean = false;
static var settingsLoaded : boolean = false;

static function LoadSettings()
{
	if( !settingsLoaded )
	{
		if( PlayerPrefs.HasKey("MusicVolume") )
		{
			musicVolume = PlayerPrefs.GetInt("MusicVolume");
		}
		if( PlayerPrefs.HasKey("SoundVolume") )
		{
			soundVolume = PlayerPrefs.GetInt("SoundVolume");
		}
		
		settingsLoaded = true;
	}
}

static function SaveSettings()
{
	PlayerPrefs.SetInt("MusicVolume", musicVolume);
	PlayerPrefs.SetInt("SoundVolume", soundVolume);
	PlayerPrefs.Save();
}

static function GetSoundVolume() : float
{
	return soundVolume * .1f;
}

static function GetMusicVolume() : float
{
	return musicVolume * .1f;
}

function SetMusicVolume( vol : int )
{
	Globals.musicVolume = vol;
}

function SetSoundVolume( vol : int )
{
	Globals.soundVolume = vol;
}

// directional information
static var axisRotations : Quaternion[];
static var axisHalfRotations : Quaternion[];

static var axisVectors : Vector3[];

static var levelxBounds : float = 15f;
static var levelzBounds : float = 10f;

static var recipSqrt2 : float = 1f / Mathf.Sqrt(2f);

enum DIRECTIONS {
					RIGHT = 0,
					DOWN_RIGHT = 1,
					DOWN = 2,
					DOWN_LEFT = 3,
					LEFT = 4,
					UP_LEFT = 5,
					UP = 6,
					UP_RIGHT = 7
				}
				
enum HALF_DIRECTIONS {
					ENE = 0,
					ESE = 1,
					SSE = 2,
					SSW = 3,
					WSW = 4,
					WNW = 5,
					NNW = 6,
					NNE = 7
				}

static function GetApproxDirectionValue( x : float, z : float ) : int
{
	return GetDirectionValue( (x < -.1f) ? -1 : ((x > .1f) ? 1 : 0), (z < -.1f) ? -1 : ((z > .1f) ? 1 : 0) );
}

static function GetDirectionValue( x : int, z : int ) : int
{
	if( z == 1 )
	{
		if( x == 1 )
		{
			return DIRECTIONS.DOWN_LEFT;
		}
		else if( x == 0 )
		{
			return DIRECTIONS.DOWN;
		}
		else if( x == -1 )
		{
			return DIRECTIONS.DOWN_RIGHT;
		}
	}
	else if( z == 0 )
	{
		if( x == 1 )
		{
			return DIRECTIONS.LEFT;
		}
		else if( x == 0 )
		{
			return -1;
		}
		else if( x == -1 )
		{
			return DIRECTIONS.RIGHT;
		}
	}
	else if( z == -1 )
	{
		if( x == 1 )
		{
			return DIRECTIONS.UP_LEFT;
		}
		else if( x == 0 )
		{
			return DIRECTIONS.UP;
		}
		else if( x == -1 )
		{
			return DIRECTIONS.UP_RIGHT;
		}
	}
	return -1;
}

static function GetDirection( x : int, z : int ) : Quaternion
{
	var dir : int = GetDirectionValue(x, z);
	return (dir < 0) ? Quaternion.identity : axisRotations[dir];
}

function Awake()
{
	//just need to initialize global data, no need for updates after that
	enabled = false;
	
	if( dataInitialized )
	{
		return;
	}
	
	axisRotations = new Quaternion[8];
	axisHalfRotations = new Quaternion[8];
	axisVectors = new Vector3[8];
	
	var i : int;
	for( i = 0 ; i < axisRotations.Length ; ++i )
	{
		switch( i )
		{
			case 0: axisVectors[i]			= Vector3( -1f, 0f, 0f);
					axisRotations[i]		= Quaternion.Euler(0,    0,0);
					axisHalfRotations[i]	= Quaternion.Euler(0,337.5,0);	break;
			case 1: axisVectors[i]			= Vector3( -recipSqrt2, 0f, recipSqrt2);
					axisRotations[i] 		= Quaternion.Euler(0, 45  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0, 22.5,0);	break;
			case 2: axisVectors[i]			= Vector3( 0f, 0f, 1f);
					axisRotations[i] 		= Quaternion.Euler(0, 90  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0, 67.5,0);	break;
			case 3: axisVectors[i]			= Vector3( recipSqrt2, 0f, recipSqrt2);
					axisRotations[i] 		= Quaternion.Euler(0,135  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0,112.5,0);	break;
			case 4: axisVectors[i]			= Vector3( 1f, 0f, 0f);
					axisRotations[i] 		= Quaternion.Euler(0,180  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0,157.5,0);	break;
			case 5: axisVectors[i]			= Vector3( recipSqrt2, 0f, -recipSqrt2);
					axisRotations[i] 		= Quaternion.Euler(0,225  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0,202.5,0);	break;
			case 6: axisVectors[i]			= Vector3( 0f, 0f, -1f);
					axisRotations[i] 		= Quaternion.Euler(0,270  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0,247.5,0);	break;
			case 7: axisVectors[i]			= Vector3( -recipSqrt2, 0f, -recipSqrt2);
					axisRotations[i] 		= Quaternion.Euler(0,315  ,0);
					axisHalfRotations[i]	= Quaternion.Euler(0,292.5,0);	break;
		}
	}
	
	dataInitialized = true;
}
