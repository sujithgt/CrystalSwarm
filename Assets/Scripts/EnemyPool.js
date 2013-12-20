#pragma strict

var template : GameObject;
var size : int;

var simpleAllocate : boolean = false;

private var enemies : GameObject[];
private var poolObjects : PoolObject[];
private var openList : int[];

private var nextObject : GameObject;

private var openListStart : int;
private var openListEnd : int;

private var objectsRemaining : int;

//var verifyOnAdd : boolean = false;

function Awake()
{
	enemies = new GameObject[size];
	poolObjects = new PoolObject[size];
	openList = new int[size];
	
	openListStart = size - 1;
	
	for( openListEnd = 0 ; openListEnd < size ; ++openListEnd )
	{
		enemies[openListEnd] = Instantiate( template, Vector3.zero, Quaternion.identity );
		enemies[openListEnd].transform.parent = transform;
		enemies[openListEnd].transform.localPosition = template.transform.localPosition;
		enemies[openListEnd].SetActive(false);
		poolObjects[openListEnd] = enemies[openListEnd].GetComponent(PoolObject);
		poolObjects[openListEnd].index = openListEnd;
		poolObjects[openListEnd].allocated = false;
		openList[openListEnd] = openListEnd;
	}
	
	openListEnd = size - 1;
	
	enabled = false;
	
	objectsRemaining = size;
}

function Allocate() : GameObject
{
	if( simpleAllocate )
	{
		openListStart = (openListStart == 0) ? (size - 1) : --openListStart;
		return enemies[openListStart];
	}
	
	if( objectsRemaining > 0 )
	{
		--objectsRemaining;
		nextObject = enemies[openList[openListStart]];
		poolObjects[openList[openListStart]].allocated = true;
		openListStart = (openListStart == 0) ? (size - 1) : --openListStart;
		/*
		if( nextObject.active )
		{
			print("returning an active object of type " + nextObject.name );
		}
		*/
		return nextObject;
	}
	return null;
}

function Release( index : int )
{
	/*
	if( verifyOnAdd )
	{
		for( var i : int = openListStart ; i != openListEnd ; --i )
		{
			if( openList[i] == index )
			{
				print("adding duplicate object of type " + enemies[0].name);
			}

			if( i == 0 )
			{
				i = size;
			}
		}
	}
	*/
	if( !simpleAllocate )
	{
		openList[openListEnd] = index;
		openListEnd = (openListEnd == 0) ? (size - 1) : --openListEnd;
		++objectsRemaining;
	}
	/*
	if( objectsRemaining > size )
	{
		print("too many objects remaining");
	}
	*/
}

function SpawnDisplayObject( pos : Vector3, player : Transform )
{
	var test : GameObject = Allocate();
	test.SetActive(true);
	test.SendMessage( "TestMode", null, SendMessageOptions.DontRequireReceiver );
	test.SendMessage( "SetPlayer", player, SendMessageOptions.DontRequireReceiver );
	test.transform.localPosition = pos;
}
