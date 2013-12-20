#pragma strict

var slot : int;

//empty items
var isEmpty : boolean;
var emptySlotText : TextMesh;
var emptyText : TextMesh;

//data display items
var slotNumberText : TextMesh;
var waveText : TextMesh;
var difficultyText : TextMesh;
var ratingText : TextMesh;
var ratingCrystal : MeshRenderer;
var detailsText : MeshRenderer;
var detailsButton : MeshRenderer;
var deleteText : MeshRenderer;
var deleteButton : MeshRenderer;

//slot creation and deletion menus
var createText : TextMesh;
var difficultySelector : UISelector;
var playerSelector : UISelector;
var deleteSelector : UISelector;

//external creation data
var debugStartWave : NameEntryText;

//save slot information
var difficulty : int;
var wave : int;
var ratings : String;
var ratingTotal : int;

//other game information
var players : int;

var saveMenuController : SaveMenuController;
private var inputManager : InputManager;
private var gameStatus : GameStatus;

var delay : float = .5f;
private var delayTime : float;

private var createState : int;
private var creatingGame : boolean;

private final var CREATESTATE_CANCELLED : int = 0;
private final var CREATESTATE_DIFFICULTY : int = 1;
private final var CREATESTATE_FINISHED : int = 2;

private final var DELETESTATE_CANCELLED : int = 10;
private final var DELETESTATE_CONFIRM : int = 11;
private final var DELETESTATE_FINISHED : int = 12;

private final var STARTSTATE_CANCELLED : int = 20;
private final var STARTSTATE_PLAYERS : int = 21;
private final var STARTSTATE_FINISHED : int = 22;

function Awake()
{
	inputManager = InputManager.Instance;
	creatingGame = false;
}

function ShowMenu()
{
	UpdateSaveDisplay();
	gameStatus = GameObject.Find("GameStatus").GetComponent(GameStatus);
}

function HideMenu()
{
	ratingCrystal.enabled = false;
	detailsText.enabled = false;
	detailsButton.enabled = false;
	deleteText.enabled = false;
	deleteButton.enabled = false;
}

function Load( saveslot : int )
{
	slot = saveslot;

	if( PlayerPrefs.HasKey("SaveWave" + slot) )
	{
		isEmpty = false;
		//players = PlayerPrefs.GetInt("SavePlayers" + slot);
		//name1 = PlayerPrefs.GetString("SaveName1" + slot);
		//score1 = PlayerPrefs.GetInt("SaveScore1" + slot);
		//lives1 = PlayerPrefs.GetInt("SaveLives1" + slot);
		//name2 = PlayerPrefs.GetString("SaveName2" + slot);
		//score2 = PlayerPrefs.GetInt("SaveScore2" + slot);
		//lives2 = PlayerPrefs.GetInt("SaveLives2" + slot);
		difficulty = PlayerPrefs.GetInt("SaveDifficulty" + slot);
		wave = PlayerPrefs.GetInt("SaveWave" + slot);
		//auto = PlayerPrefs.GetInt("SaveAuto" + slot);
		
		if( PlayerPrefs.HasKey("SaveRatings" + slot) )
		{
			ratings = PlayerPrefs.GetString("SaveRatings" + slot);
		}
		else
		{
			ratings = "";
		}

		if( ratings.Length < Globals.MAX_WAVES )
		{
			ratings = ratings.PadRight(Globals.MAX_WAVES - ratings.Length, "0"[0]);
		}
		
		if( PlayerPrefs.HasKey("SaveRatingTotal" + slot) )
		{
			ratingTotal = PlayerPrefs.GetInt("SaveRatingTotal" + slot);
		}
		else
		{
			ratingTotal = 0;
		}
	}
	else
	{
		isEmpty = true;
	}
	
	UpdateSaveDisplay();
}

function CreateSaveData()
{
	saveMenuController.gameObject.SendMessage("StopMenu");
	enabled = true;

	createState = CREATESTATE_DIFFICULTY;
	emptyText.text = "";
	UpdateCreateDisplay();
	delay = delayTime;
}

function SelectPlayers()
{
	saveMenuController.gameObject.SendMessage("StopMenu");
	enabled = true;
	
	createState = STARTSTATE_PLAYERS;
	UpdateCreateDisplay();
	delay = delayTime;
}

function DeleteSaveData()
{
	saveMenuController.gameObject.SendMessage("StopMenu");
	enabled = true;
	createState = DELETESTATE_CONFIRM;
	isEmpty = true;
	UpdateSaveDisplay();
	emptyText.text = "";
	UpdateCreateDisplay();
	delay = delayTime;
}

function Update()
{
	delayTime -= Time.deltaTime;

	//remove the input delay if all axes are released
	if( (Mathf.Abs(Input.GetAxis("P1Y")) < .2f) && (Mathf.Abs(Input.GetAxis("P2Y")) < .2f) 
	 && (Mathf.Abs(Input.GetAxis("P1X")) < .2f) && (Mathf.Abs(Input.GetAxis("P2X")) < .2f) 
	 && !inputManager.GetKey(InputManager.IB_MOVE) )
	{
		delayTime = 0f;
	}
	
	switch( createState )
	{
		case STARTSTATE_PLAYERS:
			SelectorUpdate( playerSelector );
			break;
		case CREATESTATE_DIFFICULTY:
			SelectorUpdate( difficultySelector );
			break;
		case DELETESTATE_CONFIRM:
			SelectorUpdate( deleteSelector );
			break;
	}

	if( Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_SELECT) || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) )
	{
		BackPressed();
	}
}

function BackPressed()
{
	--createState;
	UpdateCreateDisplay();
}

function SelectorUpdate( sel : UISelector )
{
	if( delayTime <= 0f )
	{
		if( Input.GetAxis("P1X") >= .2f || Input.GetAxis("P2X") >= .2f || inputManager.GetKey(InputManager.IB_LEFT) )
		{
			sel.MoveSelection(-1);
			delayTime = delay;
		}
		else if( Input.GetAxis("P1X") <= -.2f || Input.GetAxis("P2X") <= -.2f || inputManager.GetKey(InputManager.IB_RIGHT) )
		{
			sel.MoveSelection(1);
			delayTime = delay;
		}
	}
	
	if( (Mathf.Abs(Input.GetAxis("P1FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P1FireY")) >= .2f) 
	 || (Mathf.Abs(Input.GetAxis("P2FireX")) >= .2f) || (Mathf.Abs(Input.GetAxis("P2FireY")) >= .2f)
	 || inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD) )
	{
		sel.GetSelectionInformation( this.gameObject );
	}
	
	sel.ActivateSelector(true, Input.GetAxis("P1X") >= .2f || Input.GetAxis("P2X") >= .2f || inputManager.GetKey(InputManager.IB_LEFT));
	sel.ActivateSelector(false, Input.GetAxis("P1X") <= -.2f || Input.GetAxis("P2X") <= -.2f || inputManager.GetKey(InputManager.IB_RIGHT));
}

function SetPlayers( pl : int )
{
	gameStatus.PlayMenuSound();
	players = pl;
	++createState;
	UpdateCreateDisplay();
}

function SetDifficulty( dif : int )
{
	gameStatus.PlayMenuSound();
	difficulty = dif;
	++createState;
	UpdateCreateDisplay();
}

function SetDelete( del : int )
{
	gameStatus.PlayMenuSound();
	if( del == 0 )
	{
		createState = DELETESTATE_CANCELLED;
	}
	else
	{
		createState = DELETESTATE_FINISHED;
	}
	UpdateCreateDisplay();
}

private function UpdateSaveDisplay()
{
	if( isEmpty )
	{
		emptySlotText.text = "";
		slotNumberText.text = slot.ToString();
		emptyText.text = "New Game";

		waveText.text = "";
		difficultyText.text = "";
		ratingText.text = "";
		ratingCrystal.enabled = false;
		detailsText.enabled = false;
		detailsButton.enabled = false;
		deleteText.enabled = false;
		deleteButton.enabled = false;
	}
	else
	{
		emptySlotText.text = "";
		slotNumberText.text = slot.ToString();
		emptyText.text = "";

		waveText.text = "Wave " + wave;
		switch( difficulty )
		{
			case 0:		difficultyText.text = "Normal";		break;
			case 1:		difficultyText.text = "Hard";		break;
			case 2:		difficultyText.text = "Expert";		break;
		}
		ratingText.text = "" + ratingTotal + "/" + (Globals.MAX_WAVES * 3);
		ratingCrystal.enabled = true;
		detailsText.enabled = true;
		detailsButton.enabled = true;
		deleteText.enabled = true;
		deleteButton.enabled = true;
	}
}

private function UpdateCreateDisplay()
{
	delayTime = delay;
	
	switch( createState )
	{
		case CREATESTATE_CANCELLED:
			createText.gameObject.SetActive(false);
			difficultySelector.TurnOffMenu();
			difficultySelector.gameObject.SendMessage("StopMenu");
			creatingGame = false;
			enabled = false;
			UpdateSaveDisplay();
			saveMenuController.gameObject.SendMessage("StartMenu");
			break;
		case CREATESTATE_DIFFICULTY:
			createText.text = "Difficulty";
			createText.gameObject.SetActive(true);
			//reset selection on each new creation
			difficultySelector.selectedIndex = 0;
			difficultySelector.TurnOnMenu();
			difficultySelector.gameObject.SendMessage("StartMenu");
			break;
		case CREATESTATE_FINISHED:
			//dont turn off the menu, keep display up for game creation
			//createText.gameObject.SetActive(false);
			//difficultySelector.TurnOffMenu();
			//difficultySelector.gameObject.SendMessage("StopMenu");
			
			ratings = "".PadRight(Globals.MAX_WAVES, "0"[0]);
			ratingTotal = 0;
			
			// debug start wave selection
			int.TryParse( debugStartWave.GetName(), wave );
			
			if( wave <= 0 )
			{
				wave = gameStatus.defaultWave;
			}

			//don't go back to slot menu, just ask for players to start the game
			//enabled = false;
			isEmpty = false;
			//UpdateSaveDisplay();
			//saveMenuController.gameObject.SendMessage("StartMenu");

			creatingGame = true;
			createState = STARTSTATE_PLAYERS;
			UpdateCreateDisplay();
			break;
		case DELETESTATE_CANCELLED:
			createText.gameObject.SetActive(false);
			deleteSelector.TurnOffMenu();
			deleteSelector.gameObject.SendMessage("StopMenu");
			isEmpty = false;
			enabled = false;
			UpdateSaveDisplay();
			saveMenuController.gameObject.SendMessage("StartMenu");
			break;
		case DELETESTATE_CONFIRM:
			createText.gameObject.SetActive(true);
			createText.text = "Delete save data?";
			//reset selection before starting the menu
			deleteSelector.selectedIndex = 0;
			deleteSelector.TurnOnMenu();
			deleteSelector.gameObject.SendMessage("StartMenu");
			break;
		case DELETESTATE_FINISHED:
			createText.gameObject.SetActive(false);
			deleteSelector.TurnOffMenu();
			deleteSelector.gameObject.SendMessage("StopMenu");
			isEmpty = true;
			enabled = false;
			DeleteData();
			UpdateSaveDisplay();
			saveMenuController.gameObject.SendMessage("StartMenu");
			break;
		case STARTSTATE_CANCELLED:
			createText.gameObject.SetActive(false);
			playerSelector.TurnOffMenu();
			playerSelector.gameObject.SendMessage("StopMenu");
			if( creatingGame )
			{
				isEmpty = true;
				createState = CREATESTATE_DIFFICULTY;
				UpdateCreateDisplay();
			}
			else
			{
				UpdateSaveDisplay();
				saveMenuController.gameObject.SendMessage("StartMenu");
			}
			break;
		case STARTSTATE_PLAYERS:
			// player are no longer selected in this state, skip to creating game
			createState = STARTSTATE_FINISHED;
			UpdateCreateDisplay();
			/*
			//disable all other menu objects
			waveText.text = "";
			difficultyText.text = "";
			ratingText.text = "";
			ratingCrystal.enabled = false;
			detailsText.enabled = false;
			detailsButton.enabled = false;
			deleteText.enabled = false;
			deleteButton.enabled = false;

			createText.gameObject.SetActive(true);
			createText.text = "Players";
			playerSelector.SetSelectionValue(1);
			playerSelector.TurnOnMenu();
			playerSelector.gameObject.SendMessage("StartMenu");
			*/
			break;
		case STARTSTATE_FINISHED:
			if( creatingGame )
			{
				Save();
			}
			enabled = false;
			saveMenuController.StartGame();
			break;
	}
}

private function Save()
{
	//PlayerPrefs.SetInt("SavePlayers" + slot, players);
	//PlayerPrefs.SetString("SaveName1" + slot, name1);
	//PlayerPrefs.SetInt("SaveScore1" + slot, score1);
	//PlayerPrefs.SetInt("SaveLives1" + slot, lives1);
	//PlayerPrefs.SetString("SaveName2" + slot, name2);
	//PlayerPrefs.SetInt("SaveScore2" + slot, score2);
	//PlayerPrefs.SetInt("SaveLives2" + slot, lives2);
	PlayerPrefs.SetInt("SaveDifficulty" + slot, difficulty);
	PlayerPrefs.SetInt("SaveWave" + slot, wave);
	//PlayerPrefs.SetInt("SaveAuto" + slot, auto);
	PlayerPrefs.SetString("SaveRatings" + slot, ratings);
	PlayerPrefs.SetInt("SaveRatingTotal" + slot, ratingTotal);
	PlayerPrefs.Save();
}

private function DeleteData()
{
	//PlayerPrefs.DeleteKey("SavePlayers" + slot);
	//PlayerPrefs.DeleteKey("SaveName1" + slot);
	//PlayerPrefs.DeleteKey("SaveScore1" + slot);
	//PlayerPrefs.DeleteKey("SaveLives1" + slot);
	//PlayerPrefs.DeleteKey("SaveName2" + slot);
	//PlayerPrefs.DeleteKey("SaveScore2" + slot);
	//PlayerPrefs.DeleteKey("SaveLives2" + slot);
	PlayerPrefs.DeleteKey("SaveDifficulty" + slot);
	PlayerPrefs.DeleteKey("SaveWave" + slot);
	//PlayerPrefs.DeleteKey("SaveAuto" + slot);
	PlayerPrefs.DeleteKey("SaveRatings" + slot);
	PlayerPrefs.DeleteKey("SaveRatingTotal" + slot);
	PlayerPrefs.Save();
}
