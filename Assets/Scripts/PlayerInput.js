#pragma strict

var trans : Transform;
var baseSpeed : float = 6f;
private var moveDir : int;

var shotsFired : int = 0;

var bullet : EnemyPool;
private var lastBullet : GameObject;
private var lastBulletTrans : Transform;
private var bulletY : float;
var fireRate : float = .2f;
private var lastShot : float;
var bulletBaseSpeed : float = 10f;
private var bulletLineSpeed : float;
private var bulletDiagSpeed : float;
private var fireDir : int;

var anim : AnimationControl;

var doubleShot : boolean = false;
var tripleShot : boolean = false;

var isPlayer1 : boolean = true;
var score : PlayerScore;
var lives : LivesIndicator;
var levelSpawner : LevelSpawner;

var oneTouchEnabled : boolean;
var currentTarget : Transform;
var oneTouchTargetDistance : float[] = [2f, 4f, 7f, 10f];
var oneTouchTargetDistanceSq : float[] = [4f, 16f, 49f, 100f];

var cam : Camera;
var leftTouchId : int = -1;
private var leftTouchStart : Vector2;
private var leftTouchDirection : Vector2;
var rightTouchId : int = -1;
private var rightTouchStart : Vector2;
private var rightTouchDirection : Vector2;

var powerupSound : AudioClip;
var fireSound : AudioClip;
var doubleSound : AudioClip;
var tripleSound : AudioClip;
var audioSource : SoundController;

private var inputManager : InputManager;

function Awake()
{
	bulletLineSpeed = bulletBaseSpeed;
	bulletDiagSpeed = bulletBaseSpeed * Globals.recipSqrt2;
	lastShot = fireRate;
}

function Start()
{
	inputManager = InputManager.Instance;
	bulletY = bullet.template.transform.localPosition.y;

	if( !GameObject.Find("GameStatus").GetComponent(GameStatus).GetPlayerJoinStatus( isPlayer1 ? 1 : 2 ) )
	{
		this.gameObject.SetActive(false);
	}
	
	oneTouchEnabled = isPlayer1 && GameObject.Find("GameStatus").GetComponent(GameStatus).oneTouch;
}

function Update ()
{
	//don't allow the player to continue to turn while the game is paused
	if( Time.timeScale <= .05f )
	{
		return;
	}
	
	//find touch information to see what should be controlling player 1
	if( isPlayer1 && (Input.touchCount > 0 || leftTouchId != -1 || rightTouchId != -1) )
	{
		DetectTouches();
	}

	var xvel : float = 0f;
	var zvel : float = 0f;
	var mult : float;
	
	//first find player movement
	if( isPlayer1 )
	{
		#if ( UNITY_ANDROID || UNITY_IPHONE ) && !UNITY_EDITOR
			if( leftTouchId == -1 )
			{
				xvel = inputManager.GetAxis(InputManager.IA_X_ANALOG, 1);
				zvel = inputManager.GetAxis(InputManager.IA_Y_ANALOG, 1);
			}
			else
			{
				xvel = -leftTouchDirection.x;
				zvel = -leftTouchDirection.y;
			}
		#else
			xvel += ( (Input.GetAxis("P1X") < -.5f) ? -1f : 0f);
			xvel += ( (Input.GetAxis("P1X") > .5f) ? 1f : 0f);
			zvel += ( (Input.GetAxis("P1Y") < -.5f) ? -1f : 0f);
			zvel += ( (Input.GetAxis("P1Y") > .5f) ? 1f : 0f);
		#endif
	}
	else
	{
		#if ( UNITY_ANDROID || UNITY_IPHONE ) && !UNITY_EDITOR
			xvel = inputManager.GetAxis(InputManager.IA_X_ANALOG, 2);
			zvel = inputManager.GetAxis(InputManager.IA_Y_ANALOG, 2);
		#else
			xvel += ( (Input.GetAxis("P2X") < -.5f) ? -1f : 0f);
			xvel += ( (Input.GetAxis("P2X") > .5f) ? 1f : 0f);
			zvel += ( (Input.GetAxis("P2Y") < -.5f) ? -1f : 0f);
			zvel += ( (Input.GetAxis("P2Y") > .5f) ? 1f : 0f);
		#endif
	}
	
	if( xvel == 0f && zvel == 0f )
	{
		anim.ResumeAnimation("stand");
		moveDir = -1;
	}
	else if( xvel == 0 || zvel == 0 )
	{
		anim.ResumeAnimation("walk");
		trans.localPosition += Vector3(xvel, 0f, zvel) * baseSpeed * Time.deltaTime;
		moveDir = Globals.GetApproxDirectionValue(xvel, zvel);
	}
	else
	{
		anim.ResumeAnimation("walk");
		mult = (xvel * xvel) + (zvel * zvel);
		if( mult > 1f )
		{
			mult = 1f / Mathf.Sqrt(mult);
			xvel *= mult;
			zvel *= mult;
		}
		trans.localPosition += Vector3(xvel, 0f, zvel) * baseSpeed * Time.deltaTime;
		moveDir = Globals.GetApproxDirectionValue(xvel, zvel);
	}
	
	if( trans.localPosition.x < -Globals.levelxBounds )
	{
		trans.localPosition.x = -Globals.levelxBounds;
	}
	else if( trans.localPosition.x > Globals.levelxBounds )
	{
		trans.localPosition.x = Globals.levelxBounds;
	}
	
	if( trans.localPosition.z < -Globals.levelzBounds )
	{
		trans.localPosition.z = -Globals.levelzBounds;
	}
	else if( trans.localPosition.z > Globals.levelzBounds )
	{
		trans.localPosition.z = Globals.levelzBounds;
	}

	//then find player shooting
	lastShot += Time.deltaTime;
	xvel = 0f;
	zvel = 0f;
	
	if( !oneTouchEnabled )
	{
		if( isPlayer1 )
		{
			#if ( UNITY_ANDROID || UNITY_IPHONE ) && !UNITY_EDITOR
				if( rightTouchId == -1 )
				{
					xvel = inputManager.GetAxis(InputManager.IA_FIREX, 1);
					zvel = inputManager.GetAxis(InputManager.IA_FIREY, 1);
				}
				else
				{
					xvel += ( (rightTouchDirection.x < -.4f) ? 1f : 0f);
					xvel += ( (rightTouchDirection.x > .4f) ? -1f : 0f);
					zvel += ( (rightTouchDirection.y < -.4f) ? 1f : 0f);
					zvel += ( (rightTouchDirection.y > .4f) ? -1f : 0f);
				}
			#else
				xvel += ( (Input.GetAxis("P1FireX") < -.5f) ? -1f : 0f);
				xvel += ( (Input.GetAxis("P1FireX") > .5f) ? 1f : 0f);
				zvel += ( (Input.GetAxis("P1FireY") < -.5f) ? -1f : 0f);
				zvel += ( (Input.GetAxis("P1FireY") > .5f) ? 1f : 0f);
			#endif
		}
		else
		{
			#if ( UNITY_ANDROID || UNITY_IPHONE ) && !UNITY_EDITOR
				xvel = inputManager.GetAxis(InputManager.IA_FIREX, 2);
				zvel = inputManager.GetAxis(InputManager.IA_FIREY, 2);
			#else
				xvel += ( (Input.GetAxis("P2FireX") < -.5f) ? -1f : 0f);
				xvel += ( (Input.GetAxis("P2FireX") > .5f) ? 1f : 0f);
				zvel += ( (Input.GetAxis("P2FireY") < -.5f) ? -1f : 0f);
				zvel += ( (Input.GetAxis("P2FireY") > .5f) ? 1f : 0f);
			#endif
		}
	}
	else
	{
		if( currentTarget != null && !currentTarget.gameObject.activeSelf )
		{
			currentTarget = null;
		}
		
		var dir : Vector3 = (currentTarget != null) ? currentTarget.localPosition - trans.localPosition : Vector3.zero;
		var dist : float = (currentTarget != null) ? (dir.x * dir.x) + (dir.z * dir.z) : oneTouchTargetDistanceSq[oneTouchTargetDistanceSq.Length - 1] + 1f;
		var nearby : Collider[];
		
		for( var i : int = 0 ; i < oneTouchTargetDistance.Length ; ++i )
		{
			if( dist <= oneTouchTargetDistanceSq[i] )
			{
				break;
			}
			else
			{
				//overlap a sphere near the player to find closeby enemies
				nearby = Physics.OverlapSphere(trans.localPosition, oneTouchTargetDistance[i], 0x200);
				if( nearby.Length > 0 )
				{
					currentTarget = nearby[0].transform;
					dir = currentTarget.localPosition - trans.localPosition;
					break;
				}
			}
		}
		
		if( currentTarget != null )
		{
			if( Mathf.Abs(2f * dir.z) < Mathf.Abs(dir.x) )
			{
				xvel = (dir.x < 0f ) ? -1f : 1f;
				zvel = 0f;
			}
			else if( Mathf.Abs(dir.z) < Mathf.Abs(2f * dir.x) )
			{
				xvel = (dir.x < 0f ) ? -1f : 1f;
				zvel = (dir.z < 0f ) ? -1f : 1f;
			}
			else
			{
				xvel = 0;
				zvel = (dir.z < 0f ) ? -1f : 1f;
			}
		}
		else
		{
			//dont check every frame, put in some small delay when no target is found
			lastShot = .5f * fireRate;
			xvel = 0;
			zvel = 0;
		}
	}
	
	//only continue if the player is shooting
	if( xvel != 0 || zvel != 0 )
	{
		fireDir = Globals.GetDirectionValue(xvel, zvel);
		trans.localRotation = Globals.axisRotations[fireDir];
		
		if( lastShot >= fireRate )
		{
			audioSource.Play(tripleShot ? tripleSound : (doubleShot ? doubleSound : fireSound));

			FireBullet(fireDir);
			if( doubleShot )
			{
				FireBullet((fireDir + 4) % 8);
			}
			if( tripleShot )
			{
				FireBullet((fireDir + 1) % 8);
				FireBullet((fireDir + 7) % 8);
			}
		}
	}
	
	if( moveDir >= 0 )
	{
		anim.SetReverse( ((fireDir - moveDir + 13) % 8) < 3 );
	}
}

function NextWave()
{
	doubleShot = false;
	tripleShot = false;
	shotsFired = 0;
}

function GainDouble()
{
	doubleShot = true;
	audioSource.Play(powerupSound);
}

function GainTriple()
{
	tripleShot = true;
	audioSource.Play(powerupSound);
}

function GetWaveScore() : int
{
	return score.waveScore;
}

function GetShotsFired() : int
{
	return shotsFired;
}

function GetRemainingLives() : int
{
	return lives.lives;
}

function HasPowerup( type : int ) : boolean
{
	if( type == Globals.EN_POWERUP_DOUBLE )
	{
		return doubleShot;
	}
	if( type == Globals.EN_POWERUP_TRIPLE )
	{
		return tripleShot;
	}
	
	Debug.LogError("checking unknown powerup type " + type);
	return false;
}

private function FireBullet( dir : int )
{
	lastBullet = bullet.Allocate();
	if( lastBullet != null )
	{
		if( levelSpawner.waveStatus == WAVESTATE.RUNNING )
		{
			++shotsFired;
		}
		
		lastBulletTrans = lastBullet.transform;
		lastBulletTrans.localPosition = trans.localPosition;
		lastBullet.GetComponent(BulletMovement).SetVelocity( Vector3(dir, bulletLineSpeed, (isPlayer1 ? 1f : 2f)) );
		lastBulletTrans.localPosition.y = bulletY;
		lastBullet.SetActive(true);
		lastShot = 0f;
	}
}

function DetectTouches()
{
	if( Input.touchCount == 0 )
	{
		leftTouchId = -1;
		rightTouchId = -1;
	}
	else
	{
		var curTouch : Touch;
		for( var i : int = 0 ; i < Input.touchCount ; ++i )
		{
			curTouch = Input.GetTouch(i);
			if( curTouch.fingerId == leftTouchId )
			{
				if( curTouch.phase == TouchPhase.Ended || curTouch.phase == TouchPhase.Canceled )
				{
					leftTouchId = -1;
				}
				if( curTouch.phase == TouchPhase.Moved )
				{
					leftTouchDirection = ComputeTouchDirection(leftTouchStart, curTouch.position);
				}
			}
			else if( curTouch.fingerId == rightTouchId )
			{
				if( curTouch.phase == TouchPhase.Ended || curTouch.phase == TouchPhase.Canceled )
				{
					rightTouchId = -1;
				}
				if( curTouch.phase == TouchPhase.Moved )
				{
					rightTouchDirection = ComputeTouchDirection(rightTouchStart, curTouch.position);
				}
			}
			else if( curTouch.phase == TouchPhase.Began )
			{
				if( oneTouchEnabled || curTouch.position.x < (cam.pixelWidth * .5f) )
				{
					if( leftTouchId == -1 )
					{
						leftTouchId = curTouch.fingerId;
						leftTouchStart = curTouch.position;
						leftTouchDirection = Vector2.zero;
					}
				}
				else
				{
					if( rightTouchId == -1 )
					{
						rightTouchId = curTouch.fingerId;
						rightTouchStart = curTouch.position;
						rightTouchDirection = Vector2.zero;
					}
				}
			}
		}
	}
}

//internal versions of the analog conversions from InputManager
private final var analogMaxRadius : float = 70f;
private final var analogMaxRadiusSq : float = analogMaxRadius * analogMaxRadius;
private final var analogMaxRadiusRecip : float = 1f / analogMaxRadius;
private final var analogCardinalWidth : float = 3f;
private final var analogDiagonalWidth : float = 1.9f;	// = sqrt((.9*analogCardinalWidth)^2 / 2), length of triangle side where len(hyp) = .9*analogCardinalWidth (full width seemed too wide)

private function ComputeTouchDirection( start : Vector2, end : Vector2 ) : Vector2
{
	var diff : Vector2 = end - start;
	var val : float;
	
	//if applicable, snap axis values to a direction
	if( diff.x > -analogCardinalWidth && diff.x < analogCardinalWidth )
	{
		diff.x = 0f;
	}
	if( diff.y > -analogCardinalWidth && diff.y < analogCardinalWidth )
	{
		diff.y = 0f;
	}
	if( diff.x != 0f && diff.y != 0f )
	{
		//check diagonals
		if( (diff.x - diff.y) > -analogDiagonalWidth && (diff.x - diff.y) < analogDiagonalWidth )
		{
			//snap to the diagonal axis, take the average of the values
			diff.x = (diff.x + diff.y) * .5f;
			diff.y = diff.x;
		}
		else if( (diff.x + diff.y) > -analogDiagonalWidth && (diff.x + diff.y) < analogDiagonalWidth )
		{
			//snap to the negative diagonal axis, average with the negative
			diff.x = (diff.x - diff.y) * .5f;
			diff.y = -diff.x;
		}
	}
	
	//normalize the new values from [-1,1]
	val = (diff.x * diff.x) + (diff.y * diff.y);
	if( val > analogMaxRadiusSq )
	{
		val = 1f / Mathf.Sqrt(val);
		diff.x *= val;
		diff.y *= val;
	}
	else
	{
		diff.x *= analogMaxRadiusRecip;
		diff.y *= analogMaxRadiusRecip;
	}

	return diff;		
}