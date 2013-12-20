#pragma strict

var obj : GameObject;
var val : int;

var isSelected : boolean = false;

var extraSelectionOption : String = "";

//var disableSelection : int;
//private var filters : UIFilter[];

//private var shadow : StaticDropshadow;

function Awake()
{
	//shadow = this.gameObject.GetComponent(StaticDropshadow);

	/*
	var list : Array = this.gameObject.GetComponents(UIFilter);
	var i : int;

	filters = new UIFilter[list.length];
	for( i = 0 ; i < list.length ; ++i )
	{
		filters[i] = list[i];
	}
	*/
}

function GetObject() : GameObject
{
	return obj;
}

function OnSelect( obj : GameObject )
{
	if( extraSelectionOption.Length > 0 )
	{
		obj.SendMessage(extraSelectionOption);
	}
}

function ShowMenu()
{
	renderer.enabled = true;
	
	/*
	if( renderer.material.color.a != 0 )
	{
		ShowShadow();
	}
	*/
}

function HideMenu()
{
	renderer.enabled = false;

	//HideShadow();
}

/*
function ShowShadow()
{
	if( shadow != null )
	{
		shadow.shadow.renderer.enabled = true;
	}
}

function HideShadow()
{
	if( shadow != null )
	{
		shadow.shadow.renderer.enabled = false;
	}
}
*/

function SetColor( col : Material, selected : boolean )
{
	renderer.material = col;
	isSelected = selected;
	/*
	if( col.a != 0 && renderer.enabled )
	{
		ShowShadow();
	}
	else
	{
		HideShadow();
	}
	*/
}

function IsSelectable() : boolean
{
	/*
	for( var filter : UIFilter in filters )
	{
		if( !filter.selectable )
		{
			return false;
		}
	}
	*/
	return true;
}

function ExternalSelectorMoved( selector : String, newVal : int ) : int
{
	/*
	for( var filter : UIFilter in filters )
	{
		filter.Apply( selector, newVal );
	}

	if( IsSelectable() )
	{
		text.enabled = true;
	}
	else
	{
		text.enabled = false;
		if( isSelected )
		{
			return disableSelection;
		}
	}
	*/
	
	return -1;
}