#pragma strict

var screens : GameObject[];
var fadeCover : GUITexture;

var cam : Camera;

var startColor : Color;
var endColor : Color;
var openFadeTime : float;

var screenEnterFadeTime : float;
var screenTime : float;
var screenExitFadeTime : float;

enum SplashState { colorFade, enterFade, screenShow, exitFade, loadMenu };
private var currentActivity : SplashState;
private var currentTime : float;
private var currentScreen : int;

function Start()
{
	currentActivity = SplashState.colorFade;
	currentTime = openFadeTime;
	currentScreen = 0;
	cam.backgroundColor = startColor;
	fadeCover.pixelInset.width = Screen.width;
	fadeCover.pixelInset.height = Screen.height;
}

function Update()
{
	var interp : float;
	
	currentTime -= Time.deltaTime;
	if( currentTime <= 0f )
	{
		switch( currentActivity )
		{
			case SplashState.colorFade:
				cam.backgroundColor = endColor;
				fadeCover.color.a = 1f;
				fadeCover.gameObject.SetActive(true);
				screens[currentScreen].SetActive(true);
				currentTime = screenEnterFadeTime;
				currentActivity = SplashState.enterFade;
				break;
			case SplashState.enterFade:
				fadeCover.color.a = 0f;
				currentTime = screenTime;
				currentActivity = SplashState.screenShow;
				break;
			case SplashState.screenShow:
				currentTime = screenExitFadeTime;
				currentActivity = SplashState.exitFade;
				break;
			case SplashState.exitFade:
				fadeCover.color.a = 1f;
				screens[currentScreen].SetActive(false);
				++currentScreen;
				if( currentScreen < screens.Length )
				{
					screens[currentScreen].SetActive(true);
					fadeCover.color.a = 1f;
					currentTime = screenEnterFadeTime;
					currentActivity = SplashState.enterFade;
				}
				else
				{
					currentActivity = SplashState.loadMenu;
				}
				break;
			case SplashState.loadMenu:
				Application.LoadLevel("MainMenu");
				break;
		}
	}
	else
	{
		switch( currentActivity )
		{
			case SplashState.colorFade:
				interp = (openFadeTime - currentTime) / openFadeTime;
				cam.backgroundColor = (interp * endColor) + ((1f - interp) * startColor);
				break;
			case SplashState.enterFade:
				interp = (screenEnterFadeTime - currentTime) / screenEnterFadeTime;
				fadeCover.color.a = 1f - interp;
				break;
			case SplashState.exitFade:
				interp = (screenExitFadeTime - currentTime) / screenEnterFadeTime;
				fadeCover.color.a = interp;
				break;
		}
	}
}