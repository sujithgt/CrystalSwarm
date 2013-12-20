#pragma strict

var allowScroll : boolean = false;

var items : int;

var width : float;
var left : float;

var height : float;
var top : float;

var subButtons : boolean = false;
var subButtonCount : int;

var cam : Camera;
private var screenToCamScale : float;
private var screenToCamOffsetX : float;
private var screenToCamOffsetY : float;

enum TouchInputType { SELECT, SCROLL };

var touch : Touch;
var touchId : int;
var touchStart : Vector2;
var touchType : TouchInputType;

var menu : GameObject;
var acceptObject : GameObject = null;

var itemScroll : boolean = false;
var itemScrollPassive : boolean = true;

var scrollItemWidth : float;
var scrollLeftEdge : float;
var scrollRightEdge : float;

var scrollIncrement : int = 1;

function Start()
{
	screenToCamScale = -(2f * cam.orthographicSize) / cam.pixelHeight;
	screenToCamOffsetY = cam.orthographicSize;
	screenToCamOffsetX = cam.orthographicSize * cam.aspect;

	touchId = -1;
}

function Update()
{
	for( var i : int = 0 ; i < Input.touchCount ; ++i )
	{
		if( touchId == -1 && Input.GetTouch(i).phase == TouchPhase.Began )
		{
			touch = Input.GetTouch(i);
			touchId = touch.fingerId;
			touchStart.x = screenToCamOffsetX + (screenToCamScale * touch.position.x);
			touchStart.y = screenToCamOffsetY + (screenToCamScale * touch.position.y);
			touchType = TouchInputType.SELECT;
			SelectCurrentItem(touch.position);
			break;
		}
		if( touchId == Input.GetTouch(i).fingerId )
		{
			touch = Input.GetTouch(i);
			if( touch.phase == TouchPhase.Canceled )
			{
				touchId = -1;
			}
			if( touch.phase == TouchPhase.Ended )
			{
				touchId = -1;
				if( touchType == TouchInputType.SELECT )
				{
					var pos : Vector2;
					pos.x = screenToCamOffsetX + (screenToCamScale * touch.position.x);
					pos.y = screenToCamOffsetY + (screenToCamScale * touch.position.y);

					if( itemScroll && InsideScroll( pos ) )
					{
						//only accept the selection if we are not on a scroll button
						if( !CheckItemScroll(pos) )
						{
							if( acceptObject == null )
							{
								menu.SendMessage("AcceptSelection");
							}
							else
							{
								menu.SendMessage("AcceptSelection", acceptObject);
							}
						}
						else if( acceptObject != null )
						{
							// with an accept object we are working with UISelectors, they
							// need to both set the selection and accept
							menu.SendMessage("AcceptSelection", acceptObject);
						}
					}
					else if( InsideItem( pos ) )
					{
						if( acceptObject == null )
						{
							menu.SendMessage("AcceptSelection");
						}
						else
						{
							menu.SendMessage("AcceptSelection", acceptObject);
						}
					}
				}
			}
			if( touch.phase == TouchPhase.Moved )
			{
				SelectCurrentItem(touch.position);
			}
		}
	}
}

function StartMenu()
{
	enabled = true;
}

function StopMenu()
{
	enabled = false;
}

private function SelectCurrentItem( pos : Vector2 )
{
	//convert from screen position to world position
	pos.x = screenToCamOffsetX + (screenToCamScale * pos.x);
	pos.y = screenToCamOffsetY + (screenToCamScale * pos.y);
	
	if( allowScroll && Mathf.Abs(touchStart.y - pos.y) > (.8f * height * scrollIncrement) )
	{
		touchType = TouchInputType.SCROLL;
		menu.SendMessage("ScrollMenu", (touchStart.y > pos.y) ? scrollIncrement : -scrollIncrement);
		touchStart = pos;
	}
	
	if( touchType == TouchInputType.SELECT )
	{
		//only update if the touch is still within the menu
		if( InsideItem( pos ) )
		{
			var selection : int = (pos.y - top) / height;
			if( subButtons )
			{
				var xSelection : int = (pos.x - left) / (width / subButtonCount);
				menu.SendMessage("SetSelection", (selection * subButtonCount) + xSelection);
			}
			else
			{
				menu.SendMessage("SetSelection", selection);
			}
		}
		else
		{
			menu.SendMessage("ClearSelection");
		}
		
		if( itemScroll && itemScrollPassive )
		{
			CheckItemScroll(pos);
		}
	}
}

private function InsideScroll( pos : Vector2 ) : boolean
{
	if( (pos.y > top) && (pos.y < (top + (items * height))) )
	{
		return ( pos.x < scrollLeftEdge && pos.x > (scrollLeftEdge + scrollItemWidth) )
			|| ( pos.x < scrollRightEdge && pos.x > (scrollRightEdge + scrollItemWidth) );
	}
	return false;
}

private function InsideItem( pos : Vector2 ) : boolean
{
	return (pos.x < left) && (pos.x > left + width) && (pos.y > top) && (pos.y < (top + (items * height)));
}

private function CheckItemScroll( pos : Vector2 ) : boolean
{
	if( pos.x < scrollLeftEdge && pos.x > (scrollLeftEdge + scrollItemWidth) )
	{
		menu.SendMessage("ScrollSelection", -1);
		return true;
	}
	if( pos.x < scrollRightEdge && pos.x > (scrollRightEdge + scrollItemWidth) )
	{
		menu.SendMessage("ScrollSelection", 1);
		return true;
	}
	
	return false;
}