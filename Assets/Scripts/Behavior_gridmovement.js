#pragma strict

var xEdgePadding : float = 1.5f;
var zEdgePadding : float = 1f;
var xGridWidth : float = 3f;
var zGridWidth : float = 3f;
private var xTurnEdge : float;
private var zTurnEdge : float;

var trans : Transform;

var leftSideEntrance : boolean = false;
var rightSideEntrance : boolean = false;
var isEntering : boolean = false;
var hasEntered : boolean = false;

var turnLeftOnly : boolean = false;
var turnRightOnly : boolean = false;
private var turnsToTargetChange : int;
var turnLeadDistance : float = 1f;

var minBaseSpeed : float = 4.5f;
var maxBaseSpeed : float = 6f;
private var baseSpeedDifference : float;
var baseSpeed : float;

var maxSpeedMultiplier : float = .55f;
var minSpeedMultiplier : float = .2f;
private var speedMultiplierDifference : float;
var speedMultiplier : float;

var health : EnemyHealth;

var currentSpeed : float;
var currentDirection : int;
var currentVelocity : Vector3;

var player : Transform;
var levelSpawner : LevelSpawner;

private var nextUpdate : float;

function OnEnable()
{
	xTurnEdge = Globals.levelxBounds - xEdgePadding - (.5f * xGridWidth);
	zTurnEdge = Globals.levelzBounds - zEdgePadding - (.5f * zGridWidth);

	isEntering = false;
	hasEntered = false;
	nextUpdate = -10f;
	currentVelocity = Vector3.zero;
	
	speedMultiplierDifference = maxSpeedMultiplier - minSpeedMultiplier;
	speedMultiplier = minSpeedMultiplier;

	baseSpeedDifference = maxBaseSpeed - minBaseSpeed;
	baseSpeed = minBaseSpeed;
}

function TestMode()
{
	minSpeedMultiplier = 0f;
	maxSpeedMultiplier = 0f;
	speedMultiplierDifference = 0f;
	speedMultiplier = 0f;

	minBaseSpeed = 0f;
	maxBaseSpeed = 0f;
	baseSpeedDifference = 0f;
	baseSpeed = 0f;
}

function Update()
{
	if( !hasEntered && !isEntering )
	{
		// set speed for shooting
		currentSpeed = baseSpeed + (levelSpawner.speedIncrement * speedMultiplier);
	}
	else if( !hasEntered && isEntering )
	{
		nextUpdate -= Time.deltaTime;
		
		if( nextUpdate < -5f )
		{
			currentSpeed = baseSpeed + (levelSpawner.speedIncrement * speedMultiplier);
			currentVelocity = Globals.axisVectors[currentDirection] * currentSpeed;
			nextUpdate = ((trans.localPosition.x * (rightSideEntrance ? -1f : 1f)) - (Globals.levelxBounds - xEdgePadding)) / currentSpeed;
		}
		else if( nextUpdate < 0f )
		{
			trans.localPosition.x = (rightSideEntrance ? -1f : 1f) * (Globals.levelxBounds - xEdgePadding);
			isEntering = false;
			hasEntered = true;
			player = levelSpawner.GetPlayer();
			currentSpeed = baseSpeed + (levelSpawner.speedIncrement * speedMultiplier);

			currentDirection = FindTurnDirection( false );
			currentVelocity = Globals.axisVectors[currentDirection] * currentSpeed;
			trans.rotation = Globals.axisRotations[currentDirection];
			nextUpdate = ((currentDirection == DIRECTIONS.RIGHT || currentDirection == DIRECTIONS.LEFT) ? xGridWidth : zGridWidth) / currentSpeed;
			this.gameObject.SendMessage("FinishedEntering");
		}
		else
		{
			trans.localPosition += currentVelocity * Time.deltaTime;
		}
	}
	else if( hasEntered )
	{
		if( Time.deltaTime > nextUpdate )
		{
			trans.localPosition += nextUpdate * currentVelocity;
			nextUpdate -= Time.deltaTime;

			speedMultiplier = minSpeedMultiplier + ((1f - health.Percentage()) * speedMultiplierDifference);
			baseSpeed = minBaseSpeed + ((1f - health.Percentage()) * baseSpeedDifference);

			currentDirection = FindTurnDirection( false );
			currentSpeed = baseSpeed + (levelSpawner.speedIncrement * speedMultiplier);
			currentVelocity = Globals.axisVectors[currentDirection] * currentSpeed;
			trans.rotation = Globals.axisRotations[currentDirection];
			
			trans.localPosition += -nextUpdate * currentVelocity;
			nextUpdate += ((currentDirection == DIRECTIONS.RIGHT || currentDirection == DIRECTIONS.LEFT) ? xGridWidth : zGridWidth) / currentSpeed;
		}
		else
		{
			trans.localPosition += Time.deltaTime * currentVelocity;
			nextUpdate -= Time.deltaTime;
		}
	}
}

function SetPlayer( pl : Transform )
{
	player = pl;
}

function SetTurnDirection( left : boolean )
{
	turnLeftOnly = left;
	turnRightOnly = !left;
}

function ClearTurnDirection()
{
	turnLeftOnly = false;
	turnRightOnly = false;
}

function SetEntranceSide( left : boolean )
{
	leftSideEntrance = left;
	rightSideEntrance = !left;
	
	if( leftSideEntrance )
	{
		trans.localPosition.x = 16f;
		trans.localPosition.z = 0f;
		currentDirection = DIRECTIONS.RIGHT;
	}
	else if( rightSideEntrance )
	{
		trans.localPosition.x = -16f;
		trans.localPosition.z = 0f;
		currentDirection = DIRECTIONS.LEFT;
	}

	turnsToTargetChange = 4;
	trans.rotation = Globals.axisRotations[currentDirection];
}

function StartEntering()
{
	isEntering = !hasEntered;
}
/*
private function ReverseTurnDirections()
{
	if( turnLeftOnly || turnRightOnly )
	{
		turnLeftOnly = !turnLeftOnly;
		turnRightOnly = !turnRightOnly;
	}
}
*/
private function FindTurnDirection( forceTurn : boolean ) : int
{
	var shouldTurn : boolean = forceTurn;
	var newDirection : int = currentDirection;

	if( !player.gameObject.activeSelf )
	{
		player = levelSpawner.GetPlayer();
	}

	if( !shouldTurn )
	{
		if( currentDirection == DIRECTIONS.UP )
		{
			shouldTurn = (trans.localPosition.z < -zTurnEdge) || (trans.localPosition.z < (player.localPosition.z + turnLeadDistance));
		}
		else if( currentDirection == DIRECTIONS.DOWN )
		{
			shouldTurn = (trans.localPosition.z > zTurnEdge) || (trans.localPosition.z > (player.localPosition.z - turnLeadDistance));
		}
		else if( currentDirection == DIRECTIONS.RIGHT )
		{
			shouldTurn = (trans.localPosition.x < -xTurnEdge) || (trans.localPosition.x < (player.localPosition.x + turnLeadDistance));
		}
		else if( currentDirection == DIRECTIONS.LEFT )
		{
			shouldTurn = (trans.localPosition.x > xTurnEdge) || (trans.localPosition.x > (player.localPosition.x - turnLeadDistance));
		}
	}
	
	if( shouldTurn )
	{
		if( turnLeftOnly )
		{
			newDirection = (6 + currentDirection) % 8;
		}
		else if( turnRightOnly )
		{
			newDirection = (2 + currentDirection) % 8;
		}
		else
		{
			if( currentDirection == DIRECTIONS.RIGHT || currentDirection == DIRECTIONS.LEFT )
			{
				if( trans.localPosition.z > zTurnEdge )
				{
					newDirection = DIRECTIONS.UP;
				}
				else if( trans.localPosition.z < -zTurnEdge )
				{
					newDirection = DIRECTIONS.DOWN;
				}
				else
				{
					if( trans.localPosition.z < player.localPosition.z )
					{
						newDirection = DIRECTIONS.DOWN;
					}
					else
					{
						newDirection = DIRECTIONS.UP;
					}
				}
			}
			else
			{
				if( trans.localPosition.x > xTurnEdge )
				{
					newDirection = DIRECTIONS.RIGHT;
				}
				else if( trans.localPosition.x < -xTurnEdge )
				{
					newDirection = DIRECTIONS.LEFT;
				}
				else
				{
					if( trans.localPosition.x < player.localPosition.x )
					{
						newDirection = DIRECTIONS.LEFT;
					}
					else
					{
						newDirection = DIRECTIONS.RIGHT;
					}
				}
			}
		}
		
		--turnsToTargetChange;
		if( turnsToTargetChange == 0 )
		{
			turnsToTargetChange = 4;
			player = levelSpawner.GetPlayer();
		}
	}
	
	return newDirection;
}
