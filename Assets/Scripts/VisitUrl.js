#pragma strict

var url : String;

var bg : MeshRenderer;
var tx : MeshRenderer;

private var inputManager : InputManager;

function Awake()
{
#if UNITY_IPHONE
	gameObject.SetActive(false);
#endif
	inputManager = InputManager.Instance;
}

function ShowMenu()
{
	bg.enabled = true;
	tx.enabled = true;
}

function HideMenu()
{
	bg.enabled = false;
	tx.enabled = false;
}

function AcceptSelection()
{
	Application.OpenURL( url );

	inputManager.LogFlurryEvent("visit_url", ["url", url], false );
}

function ScrollMenu( unused : int )
{
}

function SetSelection( unused : int )
{
}

function ClearSelection()
{
}

