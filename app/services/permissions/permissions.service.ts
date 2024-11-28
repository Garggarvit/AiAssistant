import { AndroidApplication, Device, ios } from '@nativescript/core';
import { request, RequestPermissionOptions } from '@nativescript/permissions';

export class PermissionsService {
  private requiredPermissions = {
    android: [
      android.Manifest.permission.RECORD_AUDIO,
      android.Manifest.permission.READ_CONTACTS,
      android.Manifest.permission.CALL_PHONE,
      android.Manifest.permission.SEND_SMS,
      android.Manifest.permission.READ_EXTERNAL_STORAGE
    ],
    ios: [
      'kCLAuthorizationStatusAuthorizedWhenInUse',
      'NSMicrophoneUsageDescription',
      'NSContactsUsageDescription'
    ]
  };

  async requestPermissions(): Promise<boolean> {
    try {
      if (Device.os === 'Android') {
        for (const permission of this.requiredPermissions.android) {
          const result = await request(permission as RequestPermissionOptions);
          if (!result) {
            console.error(`Permission denied: ${permission}`);
            return false;
          }
        }
      } else if (Device.os === 'iOS') {
        // iOS permissions are handled through Info.plist
        // We'll just check microphone permission as an example
        const audioSession = AVAudioSession.sharedInstance();
        const permissionStatus = await new Promise((resolve) => {
          audioSession.requestRecordPermission((granted) => {
            resolve(granted);
          });
        });
        if (!permissionStatus) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }
}