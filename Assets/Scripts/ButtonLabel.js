#pragma strict

var buttonIcon : MeshRenderer;
var buttonLabel : MeshRenderer;

function Show()
{
	buttonIcon.enabled = true;
	buttonLabel.enabled = true;
}

function Hide()
{
	buttonIcon.enabled = false;
	buttonLabel.enabled = false;
}
