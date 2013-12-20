//
//  mChartboostWrapper.mm
//
//
//  Created by Dan Tomalesky on 13/6/5.
//
//

#import "mChartboostWrapper.h"
#import "Chartboost.h"

@implementation mChartboostWrapper

extern "C"
{
    const void mStartChartboostSession(const char *appId, const char*appSignature)
    {
        NSString *appIdStr = [NSString stringWithFormat:@"%s",appId];
        NSString *sigStr = [NSString stringWithFormat:@"%s",appSignature];
        Chartboost* cb = [Chartboost sharedChartboost];
        cb.appId = appIdStr;
        cb.appSignature = sigStr;

        [cb startSession];
    }

    const void mShowInterstitial()
    {
        Chartboost* cb = [Chartboost sharedChartboost];
        [cb showInterstitial];
    }

    const void mCacheInterstitial()
    {
        Chartboost* cb = [Chartboost sharedChartboost];
        [cb cacheInterstitial];
    }
}

@end
