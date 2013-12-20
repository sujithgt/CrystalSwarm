using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using UnityEngine;

public class Chartboost : IDisposable
{
	private static Chartboost _instance;
	public static Chartboost Instance
	{
		get
		{
			if(_instance == null) _instance = new Chartboost();
			return _instance;
		}
	}

#if !UNITY_EDITOR
	private bool stopFirstAd = false;
#endif

#if UNITY_IPHONE && !UNITY_EDITOR
	[DllImport("__Internal")]
	private static extern void mStartChartboostSession(string appId, string appSignature);
	
	[DllImport("__Internal")]
	private static extern void mShowInterstitial();
	
	[DllImport("__Internal")]
	private static extern void mCacheInterstitial();
	
	
	public void onStartSession(string appId, string appSignature){
		mStartChartboostSession(appId, appSignature);
	}
	
	public void onStart()
	{
	}

	public void onStop()
	{
	}

	public void onDestroy()
	{
	}

	public void onBackPressed()
	{
	}

	public void showInterstitial()
	{
		if(stopFirstAd || AreAdsDisabled())
		{
			stopFirstAd = false;
			return;
		}
		
		mShowInterstitial();
	}

	public void cacheInterstitial()
	{
		mCacheInterstitial();
	}

	public void Dispose(){}
	
	
#elif UNITY_ANDROID && !UNITY_EDITOR
	private AndroidJavaObject chartboostSingleton = new AndroidJavaObject("com/greenthrottle/cb/ChartBoostWrapper");
	
	public void onStartSession(string appId, string appSignature)
	{
		Debug.Log("Calling Chartboost.onStartSession " + appId + ", " + appSignature);
		chartboostSingleton.Call("onStartSession", appId, appSignature);
	}

	public void onStart()
	{
		Debug.Log("Calling Chartboost.onStart");
		chartboostSingleton.Call("onStart");
	}

	public void onStop()
	{
		Debug.Log("Calling Chartboost.onStop");
		chartboostSingleton.Call("onStop");
	}

	public void onDestroy()
	{
		Debug.Log("Calling Chartboost.onDestroy");
		chartboostSingleton.Call("onDestroy");
	}

	public void onBackPressed()
	{
		Debug.Log("Calling Chartboost.onBackPressed");
		chartboostSingleton.Call("onBackPressed");
	}

	public void showInterstitial()
	{
		if(stopFirstAd || AreAdsDisabled())
		{
			stopFirstAd = false;
			return;
		}
		chartboostSingleton.Call("showInterstitial");
	}

	public void cacheInterstitial()
	{
		chartboostSingleton.Call("cacheInterstitial");
	}

	public void Dispose()
	{
		chartboostSingleton = null;
		chartboostSingleton.Dispose();
	}
#else

	public void onStartSession(string appId, string appSignature){}

	public void onStart() {	}
	public void onStop() { }
	public void onDestroy() { }
	public void onBackPressed() { }

	public void showInterstitial() { }
	public void cacheInterstitial() { }

	public void Dispose(){}
	
#endif

	public void DisableAds()
	{
		if (!AreAdsDisabled())
		{
			PlayerPrefs.SetInt("WeLikeThatYouLikeUs", 1);
			PlayerPrefs.Save();
		}
	}

	public bool AreAdsDisabled()
	{
		return PlayerPrefs.HasKey("WeLikeThatYouLikeUs");
	}

};
