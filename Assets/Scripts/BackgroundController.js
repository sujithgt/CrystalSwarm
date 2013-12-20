#pragma strict

var currentBackground : int = 0;

var centerMaterials : Material[];
var edgeMaterials : Material[];

var centerObject : MeshRenderer;
var topEdgeObject : MeshRenderer;
var bottomEdgeObject : MeshRenderer;

private var inputManager : InputManager;
private var debugInfo : DebugDisplay;

function Awake()
{
	inputManager = InputManager.Instance;
	debugInfo = GameObject.Find("GreenThrottleSingleton").GetComponent(DebugDisplay);
}

function Update()
{
	if( debugInfo.inDebugMode )
	{
		if( inputManager.GetKeyReleased(InputManager.IB_R2) || Input.GetKeyUp(KeyCode.Alpha0) )
		{
			++currentBackground;
			if( currentBackground == centerMaterials.Length )
			{
				currentBackground = 0;
			}
			
			SetBackground( currentBackground );
		}
	}
}

function SetBackground( bg : int )
{
	centerObject.material = centerMaterials[bg];
	topEdgeObject.material = edgeMaterials[bg];
	bottomEdgeObject.material = edgeMaterials[bg];
}