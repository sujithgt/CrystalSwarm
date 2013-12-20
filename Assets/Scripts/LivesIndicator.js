#pragma strict

var cam : Camera;
var icon : GameObject;

private var width : int = 3;

var playerScore : PlayerScore;

var startingLives : int = 3;
var lives : int;

var iconDimension : float = 26f;

private var iconHeight : float;
private var iconWidth : float;

var levelSpawner : LevelSpawner;

var isPlayer1 : boolean = true;

private var status : GameStatus;

//private var fallTime : float;
private var curTime : float;

function Awake()
{
	enabled = false;
	
	iconHeight = 2f * Camera.main.orthographicSize * iconDimension / Screen.height;
	iconWidth = iconHeight;

	icon.transform.localScale.x = 1.56f * iconWidth;
	icon.transform.localScale.z = 1.56f * iconHeight;
	
	transform.localPosition.z = ((-.99 * Screen.height) + (60f + (.6f * iconDimension))) * (Camera.main.orthographicSize / Screen.height);
	
	iconHeight *= .9f;
//	iconWidth *= 1.2f;

	if( isPlayer1 )
	{
		transform.localPosition.x = (Camera.main.orthographicSize * Camera.main.aspect) - iconWidth;
	}
	else
	{
		transform.localPosition.x = -((Camera.main.orthographicSize * Camera.main.aspect) - (3 * iconWidth));
	}
	//transform.localPosition.z = -.9f * Globals.levelzBounds;

	//if( status.gameMode == GameStatus.MODE_DESCENT )
	//{
	//	startingLives = status.GetLives( isPlayer1 ? 1 : 2 );
	//}
	
	//fallTime = -1f;

	status = GameObject.Find("GameStatus").GetComponent(GameStatus);
	if( !status.GetPlayerJoinStatus( isPlayer1 ? 1 : 2 ) )
	{
		this.gameObject.SetActive(false);
		return;
	}

	for( lives = 0 ; lives < startingLives ; ++lives )
	{
		AddLifeIcon();
	}
}

function NextWave( targetLives : int )
{
	while( lives < targetLives )
	{
		AddLife();
	}
	
	while( lives > targetLives )
	{
		LoseLife(0f);
	}
}

function Refresh()
{
	NextWave( lives );
}

/*
function Update()
{
	if( fallTime > 0f )
	{
		curTime += Time.deltaTime;
		if( curTime > fallTime )
		{
			fallTime = -1f;
			curTime = 0f;
			if( lives < 0 )
			{
				levelSpawner.UnsetPlayer( isPlayer1 ? 1 : 2 );
			}
			enabled = false;
		}
	}
}
*/
function AddLife()
{
	AddLifeIcon();
	++lives;
}

function LoseLife( time : float )
{
	if( lives > 0 )
	{
		--lives;
		gameObject.BroadcastMessage( "LoseLifeNumber", lives );
	}
	/*
	if( lives < 0 )
	{
		fallTime = time;
		curTime = 0f;
		enabled = true;
	}
	*/
}

private function AddLifeIcon()
{
	var obj : GameObject = Instantiate( icon, Vector3.zero, icon.transform.localRotation );
	obj.transform.parent = this.transform;
	obj.transform.localPosition.x = (lives % width) * -iconWidth;
	obj.transform.localPosition.z = (lives / width) * iconHeight;
	obj.SetActive(true);
	obj.GetComponent(LivesIcon).SetLifeNumber( lives );
}
