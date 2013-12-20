#pragma strict

var delay : float = .5f;
private var delayTime : float;

private var inputManager : InputManager;
private var menuTransition : MainMenuTransitionController;

var items : UIItem[];
var selectedItem : int = 0;

var selectedColor : Material;
var idleColor : Material;

function Awake()
{
	inputManager = InputManager.Instance;
	menuTransition = GameObject.Find("TransitionController").GetComponent(MainMenuTransitionController);
	//inputManager.FlurryFetchAd();
	inputManager.ChartboostStart();
}

function Start()
{
	delayTime = delay;
	SetSelection(0);
}

function StartMenu()
{
	enabled = true;
	delayTime = delay;
}

function StopMenu()
{
	enabled = false;
}

function Update()
{
	delayTime -= Time.deltaTime;

	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) )
	{
		Application.Quit();
		return;
	}

	//remove the input delay if all axes are released
	if( (Mathf.Abs(Input.GetAxis("P1Y")) < .2f) && (Mathf.Abs(Input.GetAxis("P2Y")) < .2f) 
	 && !inputManager.GetKey(InputManager.IB_MOVE) )
	{
		delayTime = -1f;
	}
	
	if( delayTime < 0f )
	{
		if( (Input.GetAxis("P1Y") >= .2f) || (Input.GetAxis("P2Y") >= .2f) || inputManager.GetKey(InputManager.IB_DOWN) )
		{
			MoveSelection(1);
			delayTime = delay;
		}
		else if( (Input.GetAxis("P1Y") <= -.2f) || (Input.GetAxis("P2Y") <= -.2f) || inputManager.GetKey(InputManager.IB_UP) )
		{
			MoveSelection(-1);
			delayTime = delay;
		}
	}

	if( (Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f) 
	 || (Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f)
	 || inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) )
	{
		AcceptSelection();
	}
}

function MoveSelection( direction : int )
{
	if( selectedItem != -1 )
	{
		SetSelection( selectedItem + direction );
	}
	else
	{
		SetSelection( (direction == 1) ? (0) : (items.Length - 1) );
	}
}

function SetSelection( index : int )
{
	if( (index >= 0) && (index < items.Length) )
	{
		if( (selectedItem != -1) && (selectedItem != index) )
		{
			items[selectedItem].SetColor(idleColor, false);
		}
		selectedItem = index;
		items[selectedItem].SetColor(selectedColor, true);
	}
}

function ClearSelection()
{
	if( selectedItem != -1 )
	{
		items[selectedItem].SetColor(idleColor, false);
		selectedItem = -1;
	}
}

function AcceptSelection()
{
	if( selectedItem != -1 )
	{
		GameObject.Find("GameStatus").GetComponent(GameStatus).PlayMenuSound();
		items[selectedItem].SendMessage("OnSelect", GameObject.Find("GameStatus"));
		menuTransition.StartTransition(this.gameObject, items[selectedItem].GetComponent(UIItem).GetObject());
	}
}
