#pragma strict

//menu items
var trans : Transform;
var background : MeshRenderer;
var crystalTop : MeshRenderer;
var crystalBottom : MeshRenderer;
var tierLock : MeshRenderer;
var unlockTextRenderer : MeshRenderer;
var remainingTextRenderer : MeshRenderer;

var unlockText : TextMesh;
var remainingText : TextMesh;

//tier information
var tierNumber : int;
var locked : boolean;
var lockedDepth : float;
var unlockedDepth : float;

//selection materials
var textSelectedFont : Material;
var textUnselectedFont : Material;
var backgroundSelected : Material;
var backgroundUnselected : Material;

//state information
var selected : boolean = false;
var saveData : SaveSlot;

function SetTier( tr : int, slot : SaveSlot ) : boolean
{
	tierNumber = tr;
	saveData = slot;
	
	locked = saveData.ratingTotal < Globals.TIER_REQUIREMENT[saveData.difficulty][tierNumber];

	UpdateLocked();
	
	return locked;
}

function SetSelected( sel : boolean )
{
	if( selected == sel )
	{
		return;
	}

	selected = sel;
	
	if( selected )
	{
		if( locked )
		{
			background.material = backgroundSelected;
			unlockTextRenderer.material = textSelectedFont;
			remainingTextRenderer.material = textSelectedFont;
		}
		else
		{
			Debug.LogError("Selecting an unlocked detail tier");
		}
	}
	else
	{
		background.material = backgroundUnselected;
		unlockTextRenderer.material = textUnselectedFont;
		remainingTextRenderer.material = textUnselectedFont;
	}
}

function ShowMenu()
{
	background.enabled = true;
	UpdateLocked();
}

function HideMenu()
{
	background.enabled = false;
	crystalTop.enabled = false;	
	crystalBottom.enabled = false;	
	tierLock.enabled = false;	
	unlockTextRenderer.enabled = false;	
	remainingTextRenderer.enabled = false;	
}

private function UpdateLocked()
{
	if( locked )
	{
		unlockText.text = Globals.TIER_REQUIREMENT[saveData.difficulty][tierNumber] + " to unlock";
		remainingText.text = (Globals.TIER_REQUIREMENT[saveData.difficulty][tierNumber] - saveData.ratingTotal) + " to go";
		trans.localPosition.y = lockedDepth;
		if( background.enabled )
		{
			crystalTop.enabled = true;
			crystalBottom.enabled = true;
			tierLock.enabled = true;
			unlockTextRenderer.enabled = true;
			remainingTextRenderer.enabled = true;
		}
	}
	else
	{
		trans.localPosition.y = unlockedDepth;
		crystalTop.enabled = false;
		crystalBottom.enabled = false;
		tierLock.enabled = false;
		unlockTextRenderer.enabled = false;
		remainingTextRenderer.enabled = false;
	}
}
