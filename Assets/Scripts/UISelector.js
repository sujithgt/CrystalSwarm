#pragma strict

var selectionMessage : String;

var activeUpdate : boolean = false;

var titleText : GameObject;
var items : UIItem[];
var selectedIndex : int;
private var isFocused : boolean = false;

private var hasSelectors : boolean;
var leftSelector : MeshRenderer;
var rightSelector : MeshRenderer;

var focusedColor : Material;
var selectedColor : Material;
var unselectedTextColor : Material;
var unselectedTitleColor : Material;

var selectorIdleMaterial : Material;
var selectorActiveMaterial : Material;

var impactedSelectors : UISelector[];

function Awake()
{
	hasSelectors = ((leftSelector != null) && (rightSelector != null));
}

function Start()
{
	InitializeColors();
	
	//turn off active update for setting the initial selection
	var pauseUpdate : boolean = activeUpdate;
	activeUpdate = false;
	SetSelectionIndex( selectedIndex );
	HideMenu();
	activeUpdate = pauseUpdate;
	
	enabled = false;
}

function TurnOnMenu()
{
	isFocused = true;
	if( hasSelectors )
	{
		leftSelector.gameObject.SetActive(true);
		rightSelector.gameObject.SetActive(true);
	}
	for( var item : UIItem in items )
	{
		item.gameObject.SetActive(true);
	}
	InitializeColors();
	SetSelectionIndex( selectedIndex );
}

function ShowMenu()
{
	if( hasSelectors )
	{
		leftSelector.renderer.enabled = IsValidSelection(-1);
		rightSelector.renderer.enabled = IsValidSelection(1);
	}
}

function HideMenu()
{
	if( hasSelectors )
	{
		leftSelector.renderer.enabled = false;
		rightSelector.renderer.enabled = false;
	}
}

function TurnOffMenu()
{
	isFocused = false;
	if( hasSelectors )
	{
		leftSelector.gameObject.SetActive(false);
		rightSelector.gameObject.SetActive(false);
	}
	for( var item : UIItem in items )
	{
		item.gameObject.SetActive(false);
	}
}

function InitializeColors()
{
	for( var item : UIItem in items )
	{
		item.SetColor(unselectedTextColor, false);
	}
	SetSelectorColor( selectorIdleMaterial );
	//SetSelectorWidth();
	
	if( titleText != null )
	{
		titleText.renderer.material = unselectedTitleColor;
	}
}

function ChangeFocus( status : boolean )
{
	isFocused = status;
	if( isFocused )
	{
		items[selectedIndex].SetColor( focusedColor, true );
		SetSelectorColor( selectorIdleMaterial );
		if( titleText != null )
		{
			titleText.renderer.material = focusedColor;
		}
	}
	else
	{
		items[selectedIndex].SetColor( selectedColor, true );
		SetSelectorColor( selectorIdleMaterial );
		if( titleText != null )
		{
			titleText.renderer.material = unselectedTitleColor;
		}
	}
}

function ActivateSelector( isLeft : boolean, active : boolean )
{
	if( hasSelectors )
	{
		if( isLeft )
		{
			leftSelector.material = (active ? selectorActiveMaterial : selectorIdleMaterial);
		}
		else
		{
			rightSelector.material = (active ? selectorActiveMaterial : selectorIdleMaterial);
		}
	}
}

function MoveToSelection( selection : int )
{
	var newSelection : int = 0;
	while( selection >= 0 && newSelection < items.Length )
	{
		if( items[newSelection].IsSelectable() )
		{
			--selection;
		}
		if( selection >= 0 )
		{
			++newSelection;
		}
	}
	
	if( newSelection >= items.Length )
	{
		SetSelectionIndex( items.Length - 1 );
		if( !items[selectedIndex].IsSelectable() )
		{
			MoveSelection(-1);
		}
	}
	else
	{
		SetSelectionIndex( newSelection );
	}
}

function MoveSelection( dir : int )
{
	var newSelection : int = selectedIndex + dir;

	if( dir == 0 )
	{
		newSelection = selectedIndex;
	}
	else
	{
		while( newSelection >= 0 && newSelection < items.Length && !items[newSelection].IsSelectable() )
		{
			newSelection += dir;
		}
	}

	//make sure there is a selection in this direction that can have focus
	if( newSelection >= 0 && newSelection < items.Length )
	{
		SetSelectionIndex(newSelection);
	}
}

function ExternalSelectionMoved( selector : String, val : int )
{
	var disableSelection : int = -1;
	for( var item : UIItem in items )
	{
		if( item.isSelected )
		{
			disableSelection = item.ExternalSelectorMoved( selector, val );
		}
		else
		{
			item.ExternalSelectorMoved( selector, val );
		}
	}
	if( disableSelection >= 0 )
	{
		MoveToSelection( disableSelection );
	}
}

function CanHoldFocus() : boolean
{
	if( items.Length <= 1 )
	{
		return false;
	}

	var selectable : int = 0;
	for( var item : UIItem in items )
	{
		if( item.IsSelectable() )
		{
			selectable += 1;
			if( selectable > 1 )
			{
				return true;
			}
		}
	}
	return false;
}

function GetSelectionInformation( receiver : GameObject )
{
	//allow some selectors to not have associated data
	if( !selectionMessage.StartsWith("nd_") )
	{
		receiver.SendMessage(selectionMessage, items[selectedIndex].val);
	}
}

function SetSelectionValue( val : int )
{
	var i : int;
	for( i = 0 ; i < items.Length ; ++i )
	{
		if( items[i].val == val )
		{
			SetSelectionIndex(i);
			return;
		}
	}
}

function SetSelectionIndex( index : int )
{
	items[selectedIndex].SetColor(unselectedTextColor, false);
	if( isFocused )
	{
		items[index].SetColor(focusedColor, true);
	}
	else
	{
		items[index].SetColor(selectedColor, true);
	}
	
	selectedIndex = index;
	for( var selector : UISelector in impactedSelectors )
	{
		selector.ExternalSelectionMoved( selectionMessage, items[selectedIndex].val );
	}
	
	if( hasSelectors )
	{
		leftSelector.renderer.enabled = IsValidSelection(-1);
		rightSelector.renderer.enabled = IsValidSelection(1);
	}
	
	if( activeUpdate )
	{
		this.gameObject.SendMessage( selectionMessage, items[selectedIndex].val );
	}
}

//touch UI interaction
function ScrollSelection( direction : int )
{
	// modified for 2-3 value selections, scrolling left is the left-most item and
	// scrolling right is the right-most item
	if( direction == -1 )
	{
		SetSelectionIndex( 0 );
	}
	if( direction == 1 )
	{
		SetSelectionIndex( items.Length - 1);
	}
}

function SetSelection( index : int )
{
	// modified for 3 value selections, this sets the value to the center
	if( items.Length == 3 )
	{
		SetSelectionIndex( 1 );
	}
}

function ClearSelection()
{
	// does nothing
}

function AcceptSelection( obj : GameObject )
{
	GetSelectionInformation( obj );
}

private function SetSelectorColor( mat : Material )
{
	if( hasSelectors )
	{
		leftSelector.material = mat;
		rightSelector.material = mat;
	}
}

/* don't need this since selectors are 3d objects now
private function SetSelectorWidth()
{
	if( hasSelectors )
	{
		var width : float;
		var maxWidth : float = 0;
		var center : float = .5f + (-items[0].transform.position.x / (2f * Camera.main.orthographicSize * Camera.main.aspect));
		
		for( var item : UIItem in items )
		{
			width = .5f * item.renderer.bounds.extents.x * Camera.main.GetScreenWidth() / (Camera.main.orthographicSize * Camera.main.aspect);
			if( width > maxWidth )
			{
				maxWidth = width;
			}
		}
		
		var offset : int = maxWidth + 4;
		offset = offset - (offset % 5);
		leftSelector.transform.position.x = center;
		leftSelector.pixelInset.x = -offset;
		rightSelector.transform.position.x = center;
		rightSelector.pixelInset.x = offset;
	}
}
*/

private function IsValidSelection( dir : int ) : boolean
{
	if( dir == 0 )
	{
		return true;
	}

	var newSelection : int = selectedIndex + dir;
	while( newSelection >= 0 && newSelection < items.Length && !items[newSelection].IsSelectable() )
	{
		newSelection += dir;
	}
	
	return (newSelection >= 0 && newSelection < items.Length);
}
