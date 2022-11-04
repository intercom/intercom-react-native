#import "IntercomEventEmitter.h"
#import <Intercom/Intercom.h>


@implementation IntercomEventEmitter

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (NSDictionary<NSString *, NSString *> *)constantsToExport {
    return @{@"UNREAD_COUNT_CHANGE_NOTIFICATION": IntercomUnreadConversationCountDidChangeNotification,
            @"WINDOW_DID_HIDE_NOTIFICATION": IntercomWindowDidHideNotification,
            @"WINDOW_DID_SHOW_NOTIFICATION": IntercomWindowDidShowNotification
    };
}

- (NSArray<NSString *> *)supportedEvents {
    return @[IntercomUnreadConversationCountDidChangeNotification,
            IntercomWindowDidHideNotification, IntercomWindowDidShowNotification];
}

- (void)handleUpdateUnreadCount:(NSNotification *)notification {
    NSUInteger unreadCount = [Intercom unreadConversationCount];
    NSNumber *unreadCountNumber = @(unreadCount);
    [self sendEventWithName:IntercomUnreadConversationCountDidChangeNotification body:@{@"count": unreadCountNumber}];
}

- (void)handleWindowDidHideNotification:(NSNotification *)notification {
    [self sendEventWithName:IntercomWindowDidHideNotification body:@{@"visible": @NO}];
}

- (void)handleWindowShowHideNotification:(NSNotification *)notification {
    [self sendEventWithName:IntercomWindowDidShowNotification body:@{@"visible": @YES}];
}

// Will be called when this module's first listener is added.
- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleUpdateUnreadCount:) name:IntercomUnreadConversationCountDidChangeNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleWindowDidHideNotification:) name:IntercomWindowDidHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleWindowShowHideNotification:) name:IntercomWindowDidShowNotification object:nil];
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}


@end
