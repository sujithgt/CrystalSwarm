var updateInterval = 0.5;

private var accum = 0.0; // FPS accumulated over the interval
private var frames = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval

var inDebugMode : boolean = false;
private var enterPressedTime : float = 0f;

private var inputManager : InputManager;

private var r2Status : boolean;

private var background : BackgroundController = null;
private var prevBackground : int = 0;

var textUpdate : boolean = false;

function Start()
{
	if( !guiText )
	{
		print ("FramesPerSecond needs a GUIText component!");
		enabled = false;
		return;
	}
	guiText.enabled = inDebugMode;
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
}

function Update()
{
	if( !inDebugMode )
	{
		if( Input.GetKey(KeyCode.Alpha0) || inputManager.GetKey(InputManager.IB_R2) )
		{
			enterPressedTime += Time.deltaTime;
			if( enterPressedTime > 5f )
			{
				inDebugMode = true;
				enterPressedTime = 0f;
				guiText.enabled = true;
			    timeleft = updateInterval;
			    if( background == null && GameObject.Find("LevelBackground") != null)
			    {
			    	background = GameObject.Find("LevelBackground").GetComponent(BackgroundController);
			    }
			    textUpdate = true;
			}
		}
		else
		{
			enterPressedTime = 0f;
		}
	}
	else
	{
		if( Input.GetKey(KeyCode.Alpha0) || inputManager.GetKey(InputManager.IB_R2) )
		{
			enterPressedTime += Time.deltaTime;

		    if( background == null && GameObject.Find("LevelBackground") != null)
		    {
		    	background = GameObject.Find("LevelBackground").GetComponent(BackgroundController);
		    }
		    
			if( enterPressedTime > 5f )
			{
				inDebugMode = false;
				enterPressedTime = 0f;
				guiText.enabled = false;
			}
		}
		else
		{
			enterPressedTime = 0f;
		}

	    timeleft -= Time.deltaTime;
	    accum += Time.timeScale/Time.deltaTime;
	    ++frames;
	   
	    // Interval ended - update GUI text and start new interval
	    if( timeleft <= 0.0 )
	    {
	    	textUpdate = true;
	    }
	    
	    if( background != null && background.currentBackground != prevBackground )
	    {
	    	textUpdate = true;
	    	prevBackground = background.currentBackground;
	    }
	    
	    if( textUpdate )
	    {
			guiText.text = "" + (accum/frames).ToString("f2") + "\n\nR2 " + (r2Status ? "down" : "up") + 
				"\n" + "bg " + prevBackground;
			
			timeleft = updateInterval;
			accum = 0.0;
			frames = 0;
			textUpdate = false;
	    }
	}
}

function R2StatusUpdate( down : boolean )
{
	r2Status = down;
	textUpdate = true;
}
