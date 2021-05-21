package com.example.intercomreactnative;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.intercomreactnative.IntercomModule;

public class MainNotificationService extends FirebaseMessagingService {

  @Override
  public void onNewToken(String refreshedToken) {
    IntercomModule.sendTokenToIntercom(getApplication(), refreshedToken);
    //DO LOGIC HERE
  }

  public void onMessageReceived(RemoteMessage remoteMessage) {
    if (IntercomModule.isIntercomPush(remoteMessage)) {
      IntercomModule.handleRemotePushMessage(getApplication(), remoteMessage);
    } else {
      //HANDLE NOT INTERCOM MESSAGE
    }
  }
}
