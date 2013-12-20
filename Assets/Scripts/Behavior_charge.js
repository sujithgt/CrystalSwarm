#pragma strict

var levelSpawner : LevelSpawner;

var trans : Transform;
var anim : AnimationControl;
var prepAnim : String = "prep";
var normalAnim : String = "walk";

var normalMovement : Behavior_8wayrandom;

var baseSpeed : float = 3f;
var speedMultiplier : float = 2f;

var chargeCount : int = 5;
var prepTime : float = 1.5f;

private var curChargeCount : int;
private var curChargeState : ChargeState;
private var curPrepTime : float;
private var chargeDir : int;
private var chargeVel : Vector3;

private var nextUpdate : float = 0f;

private enum ChargeState { IDLE, PREP, MOVE };

private var xDiff : float;
private var zDiff : float;
private var slope : float;
private var vel : Vector3;

var chargeSound : AudioClip;
var audioSource : SoundController;

function OnEnable()
{
	curChargeCount = chargeCount;
	curChargeState = ChargeState.IDLE;
}

function OnDisable()
{
	// if disabled for any reason (such as despawn from player death), stop charging 
	// to spawn back in normally
	EndCharge();
}

function TestMode()
{
	curChargeCount = 1000000;
}

function Update()
{
	if( curChargeState == ChargeState.PREP )
	{
		curPrepTime += Time.deltaTime;
		if( curPrepTime >= prepTime )
		{
			chargeVel = Globals.axisVectors[chargeDir] * (baseSpeed + (speedMultiplier * levelSpawner.currentSpeed));
			curChargeState = ChargeState.MOVE;
		}
	}
	if( curChargeState == ChargeState.MOVE )
	{
		trans.localPosition += chargeVel * Time.deltaTime;

		if( chargeVel.x < 0f && trans.localPosition.x < -Globals.levelxBounds )
		{
			trans.localPosition.x = -Globals.levelxBounds;
			EndCharge();
		}
		else if( chargeVel.x > 0f && trans.localPosition.x > Globals.levelxBounds )
		{
			trans.localPosition.x = Globals.levelxBounds;
			EndCharge();
		}
		
		if( chargeVel.z < 0 && trans.localPosition.z < -Globals.levelzBounds )
		{
			trans.localPosition.z = -Globals.levelzBounds;
			EndCharge();
		}
		else if( chargeVel.z > 0 && trans.localPosition.z > Globals.levelzBounds )
		{
			trans.localPosition.z = Globals.levelzBounds;
			EndCharge();
		}
	}

	if( curChargeState != ChargeState.IDLE )
	{
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
	}
}

function BulletCollided( vel : Vector3 )
{
	if( curChargeState == ChargeState.IDLE )
	{
		--curChargeCount;
		if( curChargeCount == 0 )
		{
			audioSource.Play(chargeSound);
			normalMovement.enabled = false;
			curChargeState = ChargeState.PREP;
			anim.StartAnimation(prepAnim);
			curPrepTime = 0f;
			chargeDir = (vel.x + 4) % 8;
			trans.localRotation = Globals.axisRotations[chargeDir];
		}
	}
}

private function EndCharge()
{
	curChargeCount = chargeCount;
	curChargeState = ChargeState.IDLE;
	normalMovement.enabled = true;
	anim.StartAnimation(normalAnim);
}