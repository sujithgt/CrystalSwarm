//
//  mFlurryWrapper.m
//
//
//  Created by PRADA Hsiung on 13/3/8.
//
//

#import "mFlurryWrapper.h"
#import "Flurry.h"

@implementation mFlurryWrapper

extern "C" {
    const void mStartSession(const char *apiKey){
        NSString *key=[NSString stringWithFormat:@"%s",apiKey];
        [Flurry startSession:key];
    }
    
    
    const void mStopSession(){
        //    [Flurry stopSession];
    }
    
    const void mLogEvent(const char *msg, bool timed)
    {
        NSString *m=[NSString stringWithFormat:@"%s",msg];
        if(timed)
        {
            [Flurry logEvent:m timed:timed];
        }
        else
        {
            [Flurry logEvent:m];
        }
    }

    const void mLogEventWithParams(const char *msg, const char* keys, const char* values, bool timed)
    {
        NSString *m=[NSString stringWithFormat:@"%s",msg];
        NSString *keysString = [NSString stringWithFormat:@"%s", keys];
        NSArray* keyList = [keysString componentsSeparatedByString:@"|||"];
        NSString *valuesString = [NSString stringWithFormat:@"%s", values];
        NSArray* valueList = [valuesString componentsSeparatedByString:@"|||"];
        NSDictionary *dictionary = [NSDictionary dictionaryWithObjects:valueList forKeys:keyList];
        if(timed)
        {
            [Flurry logEvent:m withParameters:dictionary timed: timed];
        }
        else
        {
            [Flurry logEvent:m withParameters:dictionary];
        }
    }

    const void mEndTimedEvent(const char *msg){
        NSString *m=[NSString stringWithFormat:@"%s",msg];
        [Flurry endTimedEvent:m withParameters: nil];
    }
}

@end
