#pragma strict

var mf : MeshFilter;
var idleMesh : Mesh;
var focusMesh : Mesh;

var idleMaterial : Material;
var focusMaterial : Material;

var activeMaterial : Material;

var ignoreShowHide : boolean = false;

//private var shadow : StaticDropshadow;

function Awake()
{
	//shadow = this.gameObject.GetComponent(StaticDropshadow);
}

function ShowMenu()
{
	if( !ignoreShowHide )
	{
		if( activeMaterial == null )
		{
			this.renderer.enabled = true;
		}
	}
	/*
	if( shadow != null )
	{
		shadow.shadow.renderer.enabled = true;
	}
	*/
}

function HideMenu()
{
	if( !ignoreShowHide )
	{
		this.renderer.enabled = false;
	}
	/*
	if( shadow != null )
	{
		shadow.shadow.renderer.enabled = false;
	}
	*/
}

function SetFocus( focused : boolean )
{
	if( !focused && idleMaterial != null )
	{
		if( activeMaterial != null )
		{
			renderer.enabled = false;
		}
		renderer.material = idleMaterial;
	}
	if( focused )
	{
		if( activeMaterial != null && focusMaterial == null )
		{
			renderer.enabled = true;
			renderer.material = idleMaterial;
		}
		else if( focusMaterial != null )
		{
			renderer.material = focusMaterial;
		}
	}
	
	if( mf != null )
	{
		mf.mesh = focused ? focusMesh : idleMesh;
	}
}

function SetActive( active : boolean )
{
	if( !active && idleMaterial != null )
	{
		renderer.material = idleMaterial;
	}
	if( active && activeMaterial != null )
	{
		renderer.material = activeMaterial;
	}
}
