#pragma strict

private var num : int;

function Start()
{
	enabled = false;
}

function SetLifeNumber( life : int )
{
	num = life;
}

function LoseLifeNumber( life : int )
{
	if( num == life )
	{
		Destroy( this.gameObject );
	}
}