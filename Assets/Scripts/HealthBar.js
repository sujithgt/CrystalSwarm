#pragma strict

var animTime : float = 2f;
private var curAnimTime : float = animTime + 1f;

private var interp : float;
private var currentWidth : int;

private var finalLeftEdge : int;
private var finalWidth : int;

private var startLeftEdge : int;
private var startWidth : int;

private var position : HEALTHBARSIDES;

var healthBar : GUITexture;
var health : EnemyHealth;

private var startHealth : float;
private var percent : float;

private var initialize : boolean;

function Update()
{
	if( curAnimTime < animTime )
	{
		curAnimTime += Time.deltaTime;
		if( curAnimTime >= animTime )
		{
			currentWidth = finalWidth;
			healthBar.pixelInset.x = finalLeftEdge;
		}
		else
		{
			interp = curAnimTime / animTime;
			
			currentWidth = startWidth + (interp * (finalWidth - startWidth));
			healthBar.pixelInset.x = startLeftEdge + (interp * (finalLeftEdge - startLeftEdge));
		}
	}

	percent = (1f * health.curHealth) / startHealth;
	
	healthBar.pixelInset.width = percent * currentWidth;
}

function OnDisable()
{
	healthBar.enabled = false;
	position = HEALTHBARSIDES.HB_NONE;
	curAnimTime = animTime+1f;	//make sure it isn't animating on next enable
}

function AssignHealth( h : EnemyHealth )
{
	health = h;
	startHealth = health.health;
}

function UpdatePosition( p : HEALTHBARSIDES )
{
	position = p;
}

function UpdateBounds( l : int, w : int )
{
	if( !healthBar.enabled )
	{
		currentWidth = 0;
		switch( position )
		{
			case HEALTHBARSIDES.HB_LEFT:
				healthBar.pixelInset.x = l;
				break;
			case HEALTHBARSIDES.HB_CENTER:
				healthBar.pixelInset.x = l + (w/2);
				break;
			case HEALTHBARSIDES.HB_RIGHT:
				healthBar.pixelInset.x = l + w;
				break;
		}
		healthBar.enabled = true;
	}
	
	startLeftEdge = healthBar.pixelInset.x;
	startWidth = currentWidth;

	finalLeftEdge = l;
	finalWidth = w;
	
	curAnimTime = 0f;
}