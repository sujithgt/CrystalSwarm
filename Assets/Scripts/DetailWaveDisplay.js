#pragma strict

//menu items
var background : MeshRenderer;
var crystal1 : MeshRenderer;
var crystal2 : MeshRenderer;
var crystal3 : MeshRenderer;
var menuText : MeshRenderer;
var locked : MeshRenderer;

//background information
var backgroundUnselected : Material;
var backgroundSelected : Material;

//crystal information
var crystal1Filter : MeshFilter;
var crystal2Filter : MeshFilter;
var crystal3Filter : MeshFilter;

var crystalUnselectedOwned : Mesh;
var crystalUnselectedUnowned : Mesh;
var crystalSelectedOwned : Mesh;
var crystalSelectedUnowned : Mesh;

//text information
var text : TextMesh;

var textSelectedFont : Material;
var textUnselectedFont : Material;

//state information
private var selected : boolean = false;
private var crystals : int;

static final var CRYSTALS_WAVE_LOCKED : int = -1;
static final var CRYSTALS_TIER_LOCKED : int = -2;

function SetLevel( wv : int, cry : int )
{
	text.text = (wv+1).ToString();
	crystals = cry;
	
	UpdateCrystals();
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
		background.material = backgroundSelected;
		menuText.material = textSelectedFont;
	}
	else
	{
		background.material = backgroundUnselected;
		menuText.material = textUnselectedFont;
	}
	
	UpdateCrystals();
}

function ShowMenu()
{
	background.enabled = true;
	locked.enabled = (crystals == CRYSTALS_WAVE_LOCKED);
	crystal1.enabled = crystals >= 0;
	crystal2.enabled = crystals >= 0;
	crystal3.enabled = crystals >= 0;
	menuText.enabled = crystals >= 0;
}

function HideMenu()
{
	background.enabled = false;
	locked.enabled = false;
	crystal1.enabled = false;
	crystal2.enabled = false;
	crystal3.enabled = false;
	menuText.enabled = false;
}

function Locked()
{
	return crystals < 0;
}

private function UpdateCrystals()
{
	if( selected )
	{
		crystal1Filter.mesh = (crystals >= 1) ? crystalSelectedOwned : crystalSelectedUnowned;
		crystal2Filter.mesh = (crystals >= 2) ? crystalSelectedOwned : crystalSelectedUnowned;
		crystal3Filter.mesh = (crystals >= 3) ? crystalSelectedOwned : crystalSelectedUnowned;
	}
	else
	{
		if( crystals >= 0 )
		{
			if( background.enabled )
			{
				locked.enabled = false;
				crystal1.enabled = true;
				crystal2.enabled = true;
				crystal3.enabled = true;
				menuText.enabled = true;
			}
			crystal1Filter.mesh = (crystals >= 1) ? crystalUnselectedOwned : crystalUnselectedUnowned;
			crystal2Filter.mesh = (crystals >= 2) ? crystalUnselectedOwned : crystalUnselectedUnowned;
			crystal3Filter.mesh = (crystals >= 3) ? crystalUnselectedOwned : crystalUnselectedUnowned;
		}
		else
		{
			if( background.enabled )
			{
				locked.enabled = (crystals == CRYSTALS_WAVE_LOCKED);
				crystal1.enabled = false;
				crystal2.enabled = false;
				crystal3.enabled = false;
				menuText.enabled = false;
			}
		}
	}
}