package com.example.withnotifications

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.intercom.reactnative.IntercomModule

class MainNotificationService : FirebaseMessagingService() {

	override fun onNewToken(refreshedToken: String) {
	    IntercomModule.sendTokenToIntercom(application, refreshedToken)
	    // DO HOST LOGIC HERE
	}

	override fun onMessageReceived(remoteMessage: RemoteMessage) {
	    if (IntercomModule.isIntercomPush(remoteMessage)) {
	     	IntercomModule.handleRemotePushMessage(application, remoteMessage)
	    } else {
	        // DO HOST LOGIC HERE
	    }
	}
}
