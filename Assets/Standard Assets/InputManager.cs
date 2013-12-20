using UnityEngine;
using System.Collections;
using System.Globalization;
using System.Collections.Generic;

public class InputManager : MonoBehaviour
{
	//cutscene control flag
	private bool inputEnabled = true;
	
	//input axes
	public const int IA_X = 1;
	public const int IA_X_ANALOG = 2;
	public const int IA_Y = 3;
	public const int IA_Y_ANALOG = 4;
	public const int IA_FIREX = 5;
	public const int IA_FIREY = 6;
	
	//input buttons
	public const int IB_MOVE = 1;
	public const int IB_FIRE = 2;
	public const int IB_SELECT = 3;
	public const int IB_UP = 4;
	public const int IB_DOWN = 5;
	public const int IB_LEFT = 6;
	public const int IB_RIGHT = 7;
	public const int IB_MENUFORWARD = 8;
	public const int IB_MENUBACKWARD = 9;
	public const int IB_MENUDETAILS = 10;
	public const int IB_MENUDELETE = 11;
	public const int IB_MENUBUTTON = 12;
	public const int IB_R2 = 13;
	public const int IB_L2 = 14;
	public const int IB_START = 15;
	public const int IB_GREENTHROTTLE = 16;
	
	//button indices
	private const int BUTTON_A = 0;
	private const int BUTTON_X = 1;
	private const int BUTTON_B = 2;
	private const int BUTTON_Y = 3;
	private const int BUTTON_RA_A = 4;
	private const int BUTTON_RA_X = 5;
	private const int BUTTON_RA_B = 6;
	private const int BUTTON_RA_Y = 7;
	private const int BUTTON_UP = 8;
	private const int BUTTON_DOWN = 9;
	private const int BUTTON_RIGHT = 10;
	private const int BUTTON_LEFT = 11;
	private const int BUTTON_LA_UP = 12;
	private const int BUTTON_LA_DOWN = 13;
	private const int BUTTON_LA_RIGHT = 14;
	private const int BUTTON_LA_LEFT = 15;
	private const int BUTTON_SELECT = 16;
	private const int BUTTON_START = 17;
	private const int BUTTON_GREENTHROTTLE = 18;
	private const int BUTTON_R2 = 19;
	private const int BUTTON_L2 = 20;
	private const int BUTTON_END = 21;

	//button press states
	private const int BUTTON_HELD = 0;
	private const int BUTTON_PRESSED = 1;
	private const int BUTTON_RELEASED = 2;
	private const int BUTTON_STATE_END = 3;

	//controller states
	private const int MAX_PLAYERS = 2;
	private bool[,,] controllerState = new bool[BUTTON_STATE_END,MAX_PLAYERS,BUTTON_END];
	private bool allowUp;
	
	//analog indices
	private const int ANALOG_LX = 0;
	private const int ANALOG_LY = 1;
	private const int ANALOG_TRIGGER_START = 2;	//beyond this values have only one axis
	private const int ANALOG_LT = 2;
	private const int ANALOG_RT = 3;
	private const int ANALOG_END = 4;
	
	//analog data
	private float[,] analogState = new float[MAX_PLAYERS,ANALOG_END];
	private float[,] analogValue = new float[MAX_PLAYERS,ANALOG_END];
	private bool[,] analogComputed = new bool[MAX_PLAYERS,ANALOG_END];
	
	//analog computations
	private const float analogMaxRadius = 126f;
	private const float analogMaxRadiusSq = analogMaxRadius * analogMaxRadius;
	private const float analogMaxRadiusRecip = 1f / analogMaxRadius;
	private const float analogCardinalWidth = 4f;
	private const float analogDiagonalWidth = 2.7f;	// = sqrt((.9*analogCardinalWidth)^2 / 2), length of triangle side where len(hyp) = .9*analogCardinalWidth (full width seemed too wide)
	private const float analogTriggerMax = 255f;
	private const float analogTriggerMaxRecip = 1f / analogTriggerMax;
	
#if UNITY_ANDROID && !UNITY_EDITOR
	private AndroidJavaClass jc;
#endif

	public bool isShowingAd = false;
	
	// Use this for initialization
	void Awake()
	{
		if(instance != null)
		{
#if UNITY_EDITOR
			Debug.Log("Destroying Duplicate InputManager");
#endif
			Destroy(gameObject);
			return;
		}

		instance = this;
		singletonGO = this.gameObject;
		DontDestroyOnLoad(this.gameObject);
	}
	
	void OnDestroy()
	{
		if(instance == this)
		{
			instance = null;
			Destroy(singletonGO);
			singletonGO = null;
		}
	}
	
	void Start()
	{
#if UNITY_IPHONE || UNITY_ANDROID
		Screen.sleepTimeout = SleepTimeout.NeverSleep;
#endif

#if UNITY_ANDROID && !UNITY_EDITOR
		jc = new AndroidJavaClass("com.greenthrottle.unitydroid.UnityInputUnifierActivity");
		jc.CallStatic("removeLeftButtonRemap");
		jc.CallStatic("removeRightButtonRemap");
#endif

		for ( int p = 0 ; p < MAX_PLAYERS ; ++p )
		{
			for( int j = 0 ; j < BUTTON_STATE_END ; ++j )
			{
				for( int k = 0 ; k < BUTTON_END ; ++k )
				{
					controllerState[j,p,k] = false;
				}
			}
			
			for( int j = 0 ; j < ANALOG_END ; ++j )
			{
				analogState[p,j] = 0f;
				analogValue[p,j] = 0f;
				analogComputed[p,j] = false;
			}
		}
		
		allowUp = false;
	}
	
	public void Update()
	{
		allowUp = false;
	}
	
	public void LateUpdate()
	{
		for( int p = 0 ; p < MAX_PLAYERS ; ++p )
		{
			for( int k = 0 ; k < BUTTON_END ; ++k )
			{
				controllerState[BUTTON_PRESSED,p,k] = false;
				controllerState[BUTTON_RELEASED,p,k] = false;
			}
		}
	}
	
	public void OnLevelWasLoaded( int level )
	{
		for( int p = 0 ; p < MAX_PLAYERS ; ++p )
		{
			for( int j = 0 ; j < BUTTON_STATE_END ; ++j )
			{
				for( int k = 0 ; k < BUTTON_END ; ++k )
				{
					controllerState[j,p,k] = false;
				}
			}
			
			for( int j = 0 ; j < ANALOG_END ; ++j )
			{
				analogState[p,j] = 0f;
				analogValue[p,j] = 0f;
				analogComputed[p,j] = false;
			}
		}
	}
	
	private void ButtonResponse( int index, int player, bool down )
	{
		//skip up events if the controller was cleared, so only send up if it was down
		if( !down && (allowUp || controllerState[BUTTON_HELD,player,index]) )
		{
			controllerState[BUTTON_RELEASED,player,index] = true;
		}
		
		controllerState[BUTTON_HELD,player,index] = down;

		//dont let an up in the same frame clear this
		if( down )
		{
			controllerState[BUTTON_PRESSED,player,index] = true;
		}
		/*
		if( index == BUTTON_R2 && player == 0 )
		{
			gameObject.SendMessage("R2StatusUpdate", down);
		}
		*/
	}
	
	private void AnalogResponse( int index, int player, float x, float y )
	{
		if( player >= MAX_PLAYERS )
		{
			return;	
		}
		
		if( index < ANALOG_TRIGGER_START )
		{
			if( x != analogState[player, index] || y != analogState[player, index+1] )
			{
				analogState[ player, index ] = x;
				analogComputed[ player, index ] = false;
				analogState[ player, index + 1 ] = y;
				analogComputed[ player, index + 1 ] = false;
			}
		}
		else
		{
			if( x != analogState[player, index] )
			{
				analogState[ player, index ] = x;
				analogComputed[ player, index ] = false;
			}
		}
	}
	
	private void SetButton(string encodedVal, int player, bool down)
	{
		if( player >= MAX_PLAYERS )
		{
			return;	
		}
		
		//Debug.Log("UIL: UnityGame getting " + (down ? "press" : "release") + " value " + encodedVal + " from player " + (player+1));
		switch( encodedVal )
		{
			case "A":	ButtonResponse(BUTTON_A, player, down);				break;
			case "X":	ButtonResponse(BUTTON_X, player, down);				break;
			case "B":	ButtonResponse(BUTTON_B, player, down);				break;
			case "Y":	ButtonResponse(BUTTON_Y, player, down);				break;
			case "RAD":	ButtonResponse(BUTTON_RA_A, player, down);			break;
			case "RAL":	ButtonResponse(BUTTON_RA_X, player, down);			break;
			case "RAR":	ButtonResponse(BUTTON_RA_B, player, down);			break;
			case "RAU":	ButtonResponse(BUTTON_RA_Y, player, down);			break;
			case "U":	ButtonResponse(BUTTON_UP, player, down);			break;
			case "D":	ButtonResponse(BUTTON_DOWN, player, down);			break;
			case "R":	ButtonResponse(BUTTON_RIGHT, player, down);			break;
			case "L":	ButtonResponse(BUTTON_LEFT, player, down);			break;
			case "LAU":	ButtonResponse(BUTTON_LA_UP, player, down);			break;
			case "LAD":	ButtonResponse(BUTTON_LA_DOWN, player, down);		break;
			case "LAR":	ButtonResponse(BUTTON_LA_RIGHT, player, down);		break;
			case "LAL":	ButtonResponse(BUTTON_LA_LEFT, player, down);		break;
			case "SEL":	ButtonResponse(BUTTON_SELECT, player, down);		break;
			case "ST":	ButtonResponse(BUTTON_START, player, down);			break;
			case "GT":	ButtonResponse(BUTTON_GREENTHROTTLE, player, down);	break;
			case "L2":	ButtonResponse(BUTTON_L2, player, down);			break;
			case "R2":	ButtonResponse(BUTTON_R2, player, down);			break;
		}
	}
	
	public void LogFlurryEvent( string eventName, bool timed )
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("logFlurryEvent", eventName, timed);
#endif
#if UNITY_IPHONE
		FlurryAgent.Instance.logEvent( eventName, timed );
#endif
	}

	public void LogFlurryEvent( string eventName, string[] paramList, bool timed )
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("logFlurryEvent", eventName, paramList, timed);
#endif
#if UNITY_IPHONE
		Dictionary<string, string> dict = new Dictionary<string, string>();
		for(int i = 0; i < paramList.Length; i+=2)
		{
			dict.Add(paramList[i], paramList[i+1]);
		}
		FlurryAgent.Instance.logEvent(eventName, dict, timed);
#endif
	}
	
	public void LogFlurryEventEnd( string eventName )
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("logFlurryEventEnd", eventName);
#endif
#if UNITY_IPHONE
		FlurryAgent.Instance.endTimedEvent(eventName);
#endif
	}
	
	public void FlurryFetchAd()
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("flurryFetchAd");
#endif
	}

	public void FlurryDisplayAd()
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		isShowingAd = true;
		jc.CallStatic("flurryDisplayAd");
#endif
	}

	public void FlurryClearIsShowingAd()
	{
		isShowingAd = false;
	}

	public void FlurryStopAd()
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("flurryStopAd");
		isShowingAd = false;
#endif
	}

	private const string CHARTBOOST_APP_ID = "51afae8116ba471f2200000c";
	private const string CHARTBOOST_APP_SIG = "402bef31facc5f7ceeaeb73348629c3efcbdee30";

	public void ChartboostStart()
	{
		Chartboost.Instance.onStartSession(CHARTBOOST_APP_ID, CHARTBOOST_APP_SIG);
	}

	public void EnterCutscene()
	{
		inputEnabled = false;

#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("enableCutsceneMode");
#endif
	}
	
	public void LeaveCutscene()
	{
		ClearController();
		inputEnabled = true;

#if UNITY_ANDROID && !UNITY_EDITOR
		jc.CallStatic("disableCutsceneMode");
#endif
	}
	
	public void set_Button( string encodedVal )
	{
		//Debug.Log("JFL: getting set button event: " + encodedVal);
		SetButton(encodedVal.Substring(1), int.Parse(encodedVal.Substring (0,1)) - 1, true);
	}

	public void clear_Button( string encodedVal )
	{
		SetButton(encodedVal.Substring(1), int.Parse(encodedVal.Substring (0,1)) - 1, false);
	}
	
	public void controller_Event( string eventCode )
	{
		// get objects for both the in-game and the main menu response
		GameObject obj = GameObject.Find("LevelSpawner");

#if !UNITY_IPHONE		
		if( obj == null )
		{
			obj = GameObject.Find("PlayerStatusDisplay");
		}
		
		if( obj != null )
		{
			obj.SendMessage("HandleControllerEvent", eventCode);
		}
#endif
	}
	
	public void analog_Event( string encodedVal )
	{
		//Debug.Log("JFL: getting analog event: " + encodedVal);
		string[] vals = encodedVal.Split(',');
		//Debug.Log("getting message: " + vals[0] + " " + vals[1] + " " + vals[2] + " " + vals[3]);

		switch( vals[1] )
		{
			case "LA":	AnalogResponse(ANALOG_LX, int.Parse(vals[0])-1, float.Parse(vals[2]), float.Parse(vals[3]));	break;
			case "L2A":	AnalogResponse(ANALOG_LT, int.Parse(vals[0])-1, float.Parse(vals[2]), 0f);	break;
			case "R2A":	AnalogResponse(ANALOG_RT, int.Parse(vals[0])-1, float.Parse(vals[2]), 0f);	break;
		}
	}
	
	public float GetAxis( int axis, int player )
	{
		float val = 0f;
		
		if( !inputEnabled )
		{
			return 0f;
		}

		switch( axis )
		{
			case IA_X:
				val = (controllerState[BUTTON_HELD,player-1,BUTTON_LEFT]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_RIGHT]?-1f:0f)
					+ (controllerState[BUTTON_HELD,player-1,BUTTON_LA_LEFT]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_LA_RIGHT]?-1f:0f);
				break;
			case IA_X_ANALOG:
				ComputeAnalogStick(ANALOG_LX, player-1);
				val = -analogValue[player-1, ANALOG_LX] + (controllerState[BUTTON_HELD,player-1,BUTTON_LEFT]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_RIGHT]?-1f:0f);
				break;
			case IA_Y:
				val = (controllerState[BUTTON_HELD,player-1,BUTTON_DOWN]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_UP]?-1f:0f)
					+ (controllerState[BUTTON_HELD,player-1,BUTTON_LA_DOWN]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_LA_UP]?-1f:0f);
				break;
			case IA_Y_ANALOG:
				ComputeAnalogStick(ANALOG_LX, player-1);	//always compute from first axis
				val = -analogValue[player-1, ANALOG_LY] + (controllerState[BUTTON_HELD,player-1,BUTTON_DOWN]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_UP]?-1f:0f);
				break;
			case IA_FIREX:
				val = (controllerState[BUTTON_HELD,player-1,BUTTON_X]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_B]?-1f:0f)
					+ (controllerState[BUTTON_HELD,player-1,BUTTON_RA_X]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_RA_B]?-1f:0f);
				break;
			case IA_FIREY:
				val = (controllerState[BUTTON_HELD,player-1,BUTTON_A]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_Y]?-1f:0f)
					+ (controllerState[BUTTON_HELD,player-1,BUTTON_RA_A]?1f:0f) + (controllerState[BUTTON_HELD,player-1,BUTTON_RA_Y]?-1f:0f);
				break;
		}
		
		//Debug.Log("returning axis " + axis + " value of " + val);
		
		return Mathf.Min( Mathf.Max(val, -1f), 1f);
	}
	
	//input buttons
	private bool GetKey( int type, int button, int player )
	{
		if( !inputEnabled )
		{
			return false;
		}
		
		switch( button )
		{
			case IB_MOVE:
				return controllerState[type,player-1,BUTTON_UP] || controllerState[type,player-1,BUTTON_DOWN]
					|| controllerState[type,player-1,BUTTON_LEFT] || controllerState[type,player-1,BUTTON_RIGHT]
					|| controllerState[type,player-1,BUTTON_LA_UP] || controllerState[type,player-1,BUTTON_LA_DOWN]
					|| controllerState[type,player-1,BUTTON_LA_LEFT] || controllerState[type,player-1,BUTTON_LA_RIGHT];
			case IB_FIRE:
				return controllerState[type,player-1,BUTTON_A] || controllerState[type,player-1,BUTTON_B]
					|| controllerState[type,player-1,BUTTON_Y] || controllerState[type,player-1,BUTTON_X]
					|| controllerState[type,player-1,BUTTON_RA_A] || controllerState[type,player-1,BUTTON_RA_B]
					|| controllerState[type,player-1,BUTTON_RA_Y] || controllerState[type,player-1,BUTTON_RA_X];
			case IB_UP:
				return controllerState[type,player-1,BUTTON_UP] || controllerState[type,player-1,BUTTON_LA_UP];
			case IB_DOWN:
				return controllerState[type,player-1,BUTTON_DOWN] || controllerState[type,player-1,BUTTON_LA_DOWN];
			case IB_LEFT:
				return controllerState[type,player-1,BUTTON_LEFT] || controllerState[type,player-1,BUTTON_LA_LEFT];
			case IB_RIGHT:
				return controllerState[type,player-1,BUTTON_RIGHT] || controllerState[type,player-1,BUTTON_LA_RIGHT];
			case IB_MENUFORWARD:
				return controllerState[type,player-1,BUTTON_A] || controllerState[type,player-1,BUTTON_START];
			case IB_MENUBACKWARD:
				return controllerState[type,player-1,BUTTON_B];
			case IB_MENUDETAILS:
				return controllerState[type,player-1,BUTTON_X];
			case IB_MENUDELETE:
				return controllerState[type,player-1,BUTTON_Y];
			case IB_MENUBUTTON:
				return controllerState[type,player-1,BUTTON_A] || controllerState[type,player-1,BUTTON_B]
					|| controllerState[type,player-1,BUTTON_Y] || controllerState[type,player-1,BUTTON_X];
			case IB_SELECT:
				return controllerState[type,player-1,BUTTON_SELECT];
			case IB_START:
				return controllerState[type,player-1,BUTTON_START];
			case IB_GREENTHROTTLE:
				return controllerState[type,player-1,BUTTON_GREENTHROTTLE];
			case IB_R2:
				return controllerState[type,player-1,BUTTON_R2];
			case IB_L2:
				return controllerState[type,player-1,BUTTON_L2];
		}
		return false;
	}
	
	public bool GetKey( int button, int player )
	{
		return GetKey(BUTTON_HELD, button, player);
	}
	
	public bool GetKey( int button )
	{
		return (GetKey(button, 1) || GetKey(button, 2));
	}
	
	public bool GetKeyPressed( int button, int player )
	{
		return GetKey(BUTTON_PRESSED, button, player);
	}

	public bool GetKeyPressed( int button )
	{
		return GetKeyPressed(button, 1) || GetKeyPressed(button, 2);
	}
	
	public bool GetKeyReleased( int button, int player )
	{
		return GetKey(BUTTON_RELEASED, button, player);
	}

	public bool GetKeyReleased( int button )
	{
		return GetKeyReleased(button, 1) || GetKeyReleased(button, 2);
	}

	public void ClearController( int player )
	{
		--player;
		
		//keep press events for the GT button, those should survive cutscenes
		bool gtPressed = controllerState[BUTTON_PRESSED,player,BUTTON_GREENTHROTTLE];
		
		for( int i = 0 ; i < BUTTON_STATE_END ; ++i )
		{
			for( int k = 0 ; k < BUTTON_END ; ++k )
			{
				controllerState[i,player,k] = false;
			}
		}
		
		for( int i = 0 ; i < ANALOG_END ; ++i )
		{
			analogState[player, i] = 0f;
			analogValue[player, i] = 0f;
			analogComputed[player, i] = true;
		}
		
		controllerState[BUTTON_PRESSED,player,BUTTON_GREENTHROTTLE] = gtPressed;
	}
	
	public void ClearController()
	{
		ClearController(1);
		ClearController(2);
	}
	
	public void ClearControllerPartial()
	{
		ClearController();
		allowUp = true;
	}
	
	//analog input
	private void ComputeAnalogStick( int index, int player )
	{
		if( analogComputed[player, index] )
		{
			return;
		}
		
		float x = analogState[player, index];
		float y = analogState[player, index+1];
		float val;
		
		//bool reportOutput = false;
		
		//if applicable, snap axis values to a direction
		if( x > -analogCardinalWidth && x < analogCardinalWidth )
		{
			x = 0f;
		}
		if( y > -analogCardinalWidth && y < analogCardinalWidth )
		{
			y = 0f;
		}
		if( x != 0f && y != 0f )
		{
			//check diagonals
			if( (x - y) > -analogDiagonalWidth && (x - y) < analogDiagonalWidth )
			{
				//Debug.Log("anin: found positive diagonal from x: " + x + "  y: " + y);
				
				//snap to the diagonal axis, take the average of the values
				x = (x + y) * .5f;
				y = x;
			}
			else if( (x + y) > -analogDiagonalWidth && (x + y) < analogDiagonalWidth )
			{
				//Debug.Log("anin: found negative diagonal from x: " + x + "  y: " + y);

				//snap to the negative diagonal axis, average with the negative
				x = (x - y) * .5f;
				y = -x;
			}
			/*
			else
			{
				//Debug.Log("anin: found neither diagonal from x: " + x + "  y: " + y);
				reportOutput = true;
			}
			*/
		}
		
		//normalize the new values from [-1,1]
		val = (x * x) + (y * y);
		if( val > analogMaxRadiusSq )
		{
			val = 1f / Mathf.Sqrt(val);
			x *= val;
			y *= val;
		}
		else
		{
			x *= analogMaxRadiusRecip;
			y *= analogMaxRadiusRecip;
		}
		
		analogValue[player, index] = x;
		analogValue[player, index+1] = y;
		
		analogComputed[player, index] = true;
		analogComputed[player, index+1] = true;
		/*
		if( reportOutput )
		{
			Debug.Log("anin: final output x: " + x + "  y: " + y);
		}
		*/
	}
	
	private void ComputeAnalogTrigger( int index, int player )
	{
		if( analogComputed[player, index] )
		{
			return;
		}
		
		analogValue[player, index] = analogState[player, index] * analogTriggerMaxRecip;
	}
	
	private static InputManager instance = null;
	private static GameObject singletonGO = null;
	public static InputManager Instance
	{
		get
		{
			if (instance == null)
			{
				Debug.Log("Creating InputManager Interface");
				singletonGO = new GameObject();
				singletonGO.name = "GreenThrottleSingleton";
				singletonGO.AddComponent<InputManager>();
				//DontDestroyOnLoad(singletonGO);
			}

			return instance;
		}
	}
	
	
}
