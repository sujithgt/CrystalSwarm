#pragma strict

var cam : Camera;
var cutsceneFarPlane : float = 1f;
var normalFarPlane : float = 20f;

#if UNITY_ANDROID && !UNITY_EDITOR
function Awake()
{
	cam.farClipPlane = cutsceneFarPlane;
}
#endif

function RestoreFarPlane()
{
#if UNITY_ANDROID && !UNITY_EDITOR
	cam.farClipPlane = normalFarPlane;
#endif
}

function RestrictFarPlane()
{
#if UNITY_ANDROID && !UNITY_EDITOR
	cam.farClipPlane = cutsceneFarPlane;
#endif
}
