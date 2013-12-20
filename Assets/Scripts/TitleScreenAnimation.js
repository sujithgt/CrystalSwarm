#pragma strict

var splashPosition : float;
var menuPosition : float;
private var transitionTime : float;
private var velocity : float;
private var curTime : float = 0f;
private var mult : float;

var xPosition : boolean = false;

var trans : Transform;
private var hasMoved : boolean = false;

function Awake()
{
	if( !hasMoved )
	{
		if( xPosition )
		{
			trans.localPosition.x = splashPosition;
		}
		else
		{
			trans.localPosition.z = splashPosition;
		}
		enabled = false;
	}
}

function Update()
{
	curTime += Time.deltaTime * mult;
	
	if( xPosition )
	{
		trans.localPosition.x += velocity * Time.deltaTime;
	}
	else
	{
		trans.localPosition.z += velocity * Time.deltaTime;
	}
	
	if( curTime > transitionTime )
	{
		if( xPosition )
		{
			trans.localPosition.x = menuPosition;
		}
		else
		{
			trans.localPosition.z = menuPosition;
		}
		enabled = false;
	}
	
	if( curTime < 0f )
	{
		curTime = 0f;

		if( xPosition )
		{
			trans.localPosition.x = splashPosition;
		}
		else
		{
			trans.localPosition.z = splashPosition;
		}
		enabled = false;
	}
}

function StartTransition( time : float )
{
	if( !hasMoved )
	{
		mult = 1f;
		transitionTime = time;
		velocity = (menuPosition - splashPosition) / transitionTime;
		
		enabled = true;
		hasMoved = true;
	}
}

function ReverseTransition( time : float )
{
	hasMoved = false;
	curTime = time;
	mult = -1f;
	
	transitionTime = time;
	velocity = (menuPosition - splashPosition) / transitionTime;
	
	enabled = true;
}

function FinishTransition()
{
	if( xPosition )
	{
		trans.localPosition.x = menuPosition;
	}
	else
	{
		trans.localPosition.z = menuPosition;
	}

	hasMoved = true;
	enabled = false;
}