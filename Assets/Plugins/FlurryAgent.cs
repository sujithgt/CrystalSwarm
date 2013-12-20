using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using UnityEngine;

public class FlurryAgent : IDisposable
{
	private static FlurryAgent _instance;
	public static FlurryAgent Instance
	{
		get
		{
			if(_instance == null) _instance = new FlurryAgent();
			return _instance;
		}
	}

#if UNITY_IPHONE && !UNITY_EDITOR
	[DllImport("__Internal")]
	private static extern void mStartSession(string apiKey);
	
	[DllImport("__Internal")]
	private static extern void mLogEvent(string eventId, bool timed);

	[DllImport("__Internal")]
	private static extern void mLogEventWithParams(string eventId, string keyList, string valueList, bool timed);
	
	[DllImport("__Internal")]
	private static extern void mEndTimedEvent(string eventId);

	[DllImport("__Internal")]
	private static extern void mStopSession();
	
	public void onStartSession(string apiKey){
		mStartSession(apiKey);
	}
	
	public void onEndSession(){
		mStopSession();
	}
	
	public void logEvent(string eventId, bool timed=false){
		mLogEvent(eventId, timed);
	}
	
	public void setContinueSessionMillis(long milliseconds){}
	
	public void onError(string errorId, string message, string errorClass){}
	
	public void onPageView(){}
	
	public void setLogEnabled(bool enabled){}
	
	public void setUserID(string userId){}
	
	public void setAge(int age){}
	
	public void setReportLocation(bool reportLocation){}
	
	public void logEvent(string eventId, Dictionary<string, string> parameters, bool timed=false)
	{
		if(parameters.Count == 0)
		{
			return;
		}
		
		mLogEventWithParams(eventId, 
			string.Join("|||", new List<string>(parameters.Keys).ToArray()), 
			string.Join("|||", new List<string>(parameters.Values).ToArray()), timed);
	}
	
	public void endTimedEvent(string eventId)
	{
		mEndTimedEvent(eventId);
	}

	public void Dispose(){}
	
	
#elif UNITY_ANDROID  && !UNITY_EDITOR
	private AndroidJavaClass cls_FlurryAgent = new AndroidJavaClass("com.flurry.android.FlurryAgent");
	
	public void onStartSession(string apiKey)
	{
		using(AndroidJavaClass cls_UnityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer")) 
		{
			using(AndroidJavaObject obj_Activity = cls_UnityPlayer.GetStatic<AndroidJavaObject>("currentActivity")) 
			{
				cls_FlurryAgent.CallStatic("onStartSession", obj_Activity, apiKey);
			}
		}
	}
	
	public void onEndSession()
	{
		using(AndroidJavaClass cls_UnityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer")) 
		{
			using(AndroidJavaObject obj_Activity = cls_UnityPlayer.GetStatic<AndroidJavaObject>("currentActivity")) 
			{
				cls_FlurryAgent.CallStatic("onEndSession", obj_Activity);
			}
		}
	}
	
	public void logEvent(string eventId, bool timed = false)
	{
		if(timed)
		{
			cls_FlurryAgent.CallStatic("logEvent", eventId, timed);
		}
		else
		{
			cls_FlurryAgent.CallStatic("logEvent", eventId);
		}
	}
	
	public void setContinueSessionMillis(long milliseconds)
	{
		cls_FlurryAgent.CallStatic("setContinueSessionMillis", milliseconds);
	}
	
	public void onError(string errorId, string message, string errorClass)
	{
		cls_FlurryAgent.CallStatic("onError", errorId, message, errorClass);
	}
	
	public void onPageView()
	{
		cls_FlurryAgent.CallStatic("onPageView");
	}
	
	public void setLogEnabled(bool enabled)
	{
		cls_FlurryAgent.CallStatic("setLogEnabled", enabled);
	}
	
	public void setUserID(string userId)
	{
		cls_FlurryAgent.CallStatic("setUserID", userId);
	}
	
	public void setAge(int age)
	{
		cls_FlurryAgent.CallStatic("setAge", age);
	}
	
	/*
	// Not working, and I don't need it, so I'm not going to worry about it
	private static AndroidJavaClass cls_FlurryAgentConstants = new AndroidJavaClass("com.flurry.android.FlurryAgent.Constants");
	public enum Gender
	{
		Male,
		Female
	}
	
	public void setGender(Gender gender)
	{
		byte javaGender = (gender == Gender.Male ? cls_FlurryAgentConstants.Get<byte>("MALE") : cls_FlurryAgentConstants.Get<byte>("FEMALE"));
		cls_FlurryAgent.CallStatic("setGender", javaGender);
	}
	*/
	
	public void setReportLocation(bool reportLocation)
	{
		cls_FlurryAgent.CallStatic("setReportLocation", reportLocation);
	}
	
	public void logEvent(string eventId, Dictionary<string, string> parameters, bool timed = false)
	{
		using(AndroidJavaObject obj_HashMap = new AndroidJavaObject("java.util.HashMap")) 
		{
			// Call 'put' via the JNI instead of using helper classes to avoid:
			// 	"JNI: Init'd AndroidJavaObject with null ptr!"
			IntPtr method_Put = AndroidJNIHelper.GetMethodID(obj_HashMap.GetRawClass(), "put", 
				"(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
			
			object[] args = new object[2];
			foreach(KeyValuePair<string, string> kvp in parameters)
			{
				using(AndroidJavaObject k = new AndroidJavaObject("java.lang.String", kvp.Key))
				{
					using(AndroidJavaObject v = new AndroidJavaObject("java.lang.String", kvp.Value))
					{
						args[0] = k;
						args[1] = v;
						AndroidJNI.CallObjectMethod(obj_HashMap.GetRawObject(), 
							method_Put, AndroidJNIHelper.CreateJNIArgArray(args));
					}
				}
			}
			if(timed)
			{
				cls_FlurryAgent.CallStatic("logEvent", eventId, obj_HashMap, timed);
			}
			else
			{
				cls_FlurryAgent.CallStatic("logEvent", eventId, obj_HashMap);
			}
		}
	}

	public void endTimedEvent(string eventId)
	{
		cls_FlurryAgent.CallStatic("endTimedEvent", eventId);
	}

	public void Dispose()
	{
		cls_FlurryAgent.Dispose();
	}
#else

	public void onStartSession(string apiKey){}
	
	public void onEndSession(){}
	
	public void logEvent(string eventId, bool timed=false){}
	
	public void setContinueSessionMillis(long milliseconds){}
	
	public void onError(string errorId, string message, string errorClass){}
	
	public void onPageView(){}
	
	public void setLogEnabled(bool enabled){}
	
	public void setUserID(string userId){}
	
	public void setAge(int age){}
	
	public void setReportLocation(bool reportLocation){}
	
	public void logEvent(string eventId, Dictionary<string, string> parameters, bool timed=false){}
	
	public void endTimedEvent(string eventId) {}

	public void Dispose(){}
	
#endif
};
