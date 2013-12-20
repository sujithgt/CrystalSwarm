#pragma strict

var checkExtension : boolean = true;
var bundleVersion : int;
var downloadText : GUIText;
private var expPath : String;

var splashVideo : String = "GTLogo.m4v";

enum CutsceneState { downloading, waiting, opening, playing, loading, error };
private var currentActivity : CutsceneState;
private var currentTime : float;
private var currentScreen : int;

private var inputManager : InputManager;

function Awake()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
}

function Start()
{
#if UNITY_ANDROID && !UNITY_EDITOR
	if( checkExtension )
	{
		currentActivity = CutsceneState.downloading;
	}
	else
	{
		currentActivity = CutsceneState.opening;
	}
#else
	currentActivity = CutsceneState.loading;
#endif
}

function Update()
{
	switch( currentActivity )
	{
		case CutsceneState.downloading:
#if UNITY_ANDROID && !UNITY_EDITOR
			expPath = GooglePlayDownloader.GetExpansionFilePath();
			if (expPath == null)
			{
				downloadText.enabled = true;
				downloadText.text = "External storage not available";
				currentActivity = CutsceneState.error;
				return;
			}
			else
			{
				var mainPath : String = GooglePlayDownloader.GetMainOBBPath(expPath);
				if( mainPath == null )
				{
					GooglePlayDownloader.FetchOBB();
				}
				else
				{
					CheckForDownload();
				}
				currentActivity = CutsceneState.waiting;
			}
#endif
			break;
		case CutsceneState.waiting:
			break;
		case CutsceneState.opening:
#if UNITY_ANDROID && !UNITY_EDITOR
			Handheld.PlayFullScreenMovie(splashVideo, Color.black, FullScreenMovieControlMode.Hidden, FullScreenMovieScalingMode.AspectFit);
			currentActivity = CutsceneState.playing;
#else
			currentActivity = CutsceneState.loading;
#endif
			break;
		case CutsceneState.loading:
			if( Application.levelCount == 1 )
			{
				downloadText.enabled = true;
				downloadText.text = "Cannot read expansion file";
				currentActivity = CutsceneState.error;
			}
			else
			{
				currentActivity = CutsceneState.error;
				Application.LoadLevel("MainMenu");
			}
			break;
		case CutsceneState.error:
			if( !downloadText.enabled )
			{
				downloadText.enabled = true;
				downloadText.text = "Cannot read expansion file";
			}
			if( Input.touchCount != 0 || Input.GetKeyUp(KeyCode.Escape) || inputManager.GetKeyReleased(InputManager.IB_MENUFORWARD)
			 || inputManager.GetKeyReleased(InputManager.IB_MENUBACKWARD) || inputManager.GetKeyReleased(InputManager.IB_SELECT) )
			{
				Application.Quit();
			}
			break;
	}
}

function OnApplicationPause( isPausing : boolean )
{
	if( !isPausing && currentActivity == CutsceneState.waiting )
	{
		CheckForDownload();
	}
	if( !isPausing && currentActivity == CutsceneState.playing )
	{
		yield WaitForSeconds(1f);
		currentActivity = CutsceneState.loading;
	}
}

function CheckForDownload()
{
	var mainPath : String = GooglePlayDownloader.GetMainOBBPath(expPath);
	
	if( mainPath == null )
	{
		downloadText.enabled = true;
		downloadText.text = "Data download failed. Make sure you are\nconnected to the internet and try again.\n\nPress to exit.";
		currentActivity = CutsceneState.error;
		return;
	}
	
	var www : WWW = WWW.LoadFromCacheOrDownload("file://" + mainPath, bundleVersion);
	yield www;

	if( www.error != null )
	{
		downloadText.enabled = true;
		downloadText.text = "WWW error: " + www.error;
	}
	else
	{
		currentActivity = CutsceneState.opening;
	}
}
