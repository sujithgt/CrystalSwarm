#pragma strict

private var inputManager : InputManager;
private var gameStatus : GameStatus;

var levelSpawner : LevelSpawner;
var pauseMenu : PauseGame;

var line1Text : TextMesh;
var line1TextRenderer : MeshRenderer;
var line2Text : TextMesh;
var line2TextRenderer : MeshRenderer;

var crystalRenderer : MeshRenderer;
var menuSelection : MeshRenderer;

var delay : float = .5f;
private var delayTime : float;

function Awake()
{
	inputManager = InputManager.Instance;
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
}

function Update()
{
	delayTime -= Time.deltaTime;

	//remove the input delay if all axes are released
	if( !inputManager.GetKey(InputManager.IB_MENUFORWARD) 
	 && !inputManager.GetKey(InputManager.IB_MENUBACKWARD) && !inputManager.GetKey(InputManager.IB_SELECT)
	 && (Mathf.Abs(Input.GetAxis("P1FireX")) < .2f) && (Mathf.Abs(Input.GetAxis("P1FireY")) < .2f) 
	 && (Mathf.Abs(Input.GetAxis("P2FireX")) < .2f) && (Mathf.Abs(Input.GetAxis("P2FireY")) < .2f) )
	{
		delayTime = 0f;
	}
	
	if( delayTime <= 0f )
	{
		if( inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD)
		 || inputManager.GetKey(InputManager.IB_MENUBACKWARD) || inputManager.GetKey(InputManager.IB_SELECT)
		 || (Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f)
		 || (Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f) )
		{
			AcceptSelection();
		}
	}
}

function AcceptSelection()
{
	gameStatus.PlayMenuSound();
	gameStatus.startInDetails = true;
	gameStatus.detailsWave = levelSpawner.currentWave;
	Application.LoadLevel("MainMenu");
}

function ShowMenu()
{
	pauseMenu.DisablePause();

	line1Text.text = "  " + (Globals.TIER_REQUIREMENT[gameStatus.difficulty][(levelSpawner.currentWave+1)/10] - gameStatus.ratingTotal) 
					+ " more needed";
	line1TextRenderer.enabled = true;
	line2TextRenderer.enabled = true;
	crystalRenderer.enabled = true;
	menuSelection.enabled = true;
	
	enabled = true;
	delayTime = delay;
	
	//also enable the touch controls on this object
	gameObject.SendMessage("StartMenu");
}

function HideMenu()
{
	line1TextRenderer.enabled = false;
	line2TextRenderer.enabled = false;
	crystalRenderer.enabled = false;
	menuSelection.enabled = false;
	
	enabled = false;
}
