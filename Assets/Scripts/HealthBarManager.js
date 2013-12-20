#pragma strict

var leftEdge : int = -400;
var totalWidth : int = 800;
var separatorDistance : int = 40;

var healthBars : HealthBar[];
private var healthBarPositions : HEALTHBARSIDES[];
private var activeBars : int = 0;
private var nextHealthBar : int = 0;

private var allowRequests : boolean = true;
private var pauseUpdates = false;

enum HEALTHBARSIDES { HB_NONE = 0, HB_LEFT = 1, HB_CENTER = 2, HB_RIGHT = 3 }

function Awake()
{
	healthBarPositions = new HEALTHBARSIDES[healthBars.Length];
}

function PauseUpdates()
{
	pauseUpdates = true;
}

function ResumeUpdates()
{
	pauseUpdates = false;
	
	if( activeBars > 0 )
	{
		ResizeHealthBars();
	}
}

function DenyRequests()
{
	allowRequests = false;
}

function AllowRequests()
{
	allowRequests = true;
}

function RequestHealthBar( health : EnemyHealth, dir : HEALTHBARSIDES ) : int
{
	if( !allowRequests )
	{
		return -1;
	}

	if( activeBars >= healthBars.Length )
	{
		Debug.LogError("Asking for more health bars than are provided");
		return -1;
	}
	
	++activeBars;
	while( healthBars[nextHealthBar].gameObject.activeSelf )
	{
		++nextHealthBar;
		if( nextHealthBar == healthBars.Length )
		{
			nextHealthBar = 0;
		}
	}
	
	healthBarPositions[nextHealthBar] = dir;
	healthBars[nextHealthBar].AssignHealth( health );
	healthBars[nextHealthBar].gameObject.SetActive(true);
	healthBars[nextHealthBar].UpdatePosition( healthBarPositions[nextHealthBar] );

	UpdateBarPositions( dir, true, nextHealthBar );
	ResizeHealthBars();
	
	return nextHealthBar;
}

function ReleaseHealthBar( index : int )
{
	--activeBars;
	
	if( healthBars[index] != null )
	{
		healthBars[index].gameObject.SetActive(false);
	}

	if( activeBars > 0 )
	{
		UpdateBarPositions( healthBarPositions[index], false, index );
		ResizeHealthBars();
	}
}

private function ResizeHealthBars()
{
	if( !pauseUpdates )
	{
		var barWidth : int = (totalWidth - (separatorDistance * (activeBars-1))) / activeBars;
		
		for( var i : int = 0 ; i < healthBars.Length ; ++i )
		{
			if( healthBars[i].gameObject.activeSelf )
			{
				switch( healthBarPositions[i] )
				{
					case HEALTHBARSIDES.HB_LEFT:
						healthBars[i].UpdateBounds(leftEdge, barWidth);
						break;
					case HEALTHBARSIDES.HB_CENTER:
						healthBars[i].UpdateBounds(leftEdge + ((activeBars/2) * (barWidth + separatorDistance)), barWidth);
						break;
					case HEALTHBARSIDES.HB_RIGHT:
						healthBars[i].UpdateBounds(leftEdge + totalWidth - barWidth, barWidth);
						break;
				}
			}
		}
	}
}

private function UpdateBarPositions( side : HEALTHBARSIDES, added : boolean, index : int )
{
	var i : int;
	
	switch( activeBars )
	{
		case 1:
			//one health bar should always be set to the center
			if( added )
			{
				healthBarPositions[i] = HEALTHBARSIDES.HB_CENTER;
				healthBars[i].UpdatePosition( healthBarPositions[i] );
			}
			else
			{
				for( i = 0 ; i < healthBars.Length ; ++i )
				{
					if( healthBars[i].gameObject.activeSelf )
					{
						healthBarPositions[i] = HEALTHBARSIDES.HB_CENTER;
						healthBars[i].UpdatePosition( healthBarPositions[i] );
						return;
					}
				}
			}
			break;
		case 2:
			//a center bar cannot be added here, but if a center bar is removed no update is needed
			if( side != HEALTHBARSIDES.HB_CENTER )
			{
				//need to find the center bar and reset it to left/right as needed
				for( i = 0 ; i < healthBars.Length ; ++i )
				{
					if( healthBars[i].gameObject.activeSelf && (healthBarPositions[i] == HEALTHBARSIDES.HB_CENTER) )
					{
						if( added )
						{
							healthBarPositions[i] = (side == HEALTHBARSIDES.HB_LEFT) ? HEALTHBARSIDES.HB_RIGHT : HEALTHBARSIDES.HB_LEFT;
							healthBars[i].UpdatePosition( healthBarPositions[i] );
							return;
						}
						else
						{
							healthBarPositions[i] = side;
							healthBars[i].UpdatePosition( healthBarPositions[i] );
							return;
						}
					}
				}
			}
			break;
		case 3:
			//adding to the left/right, the current left/right becomes centered
			for( i = 0 ; i < healthBars.Length ; ++i )
			{
				if( i != index && healthBars[i].gameObject.activeSelf && healthBarPositions[i] == side )
				{
					healthBarPositions[i] = HEALTHBARSIDES.HB_CENTER;
					healthBars[i].UpdatePosition( healthBarPositions[i] );
					return;
				}
			}
			break;
	}
}