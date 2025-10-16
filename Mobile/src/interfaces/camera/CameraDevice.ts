import {
  launchCamera,
  CameraOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';

export interface CameraPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

export class CameraDevice {
  async checkPermission(): Promise<CameraPermissionStatus> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        return {
          granted,
          canAskAgain: true,
        };
      } catch (error) {
        console.error('Permission check error:', error);
        return {
          granted: false,
          canAskAgain: true,
        };
      }
    }
    // iOS handles permissions automatically through launchCamera
    return {
      granted: true,
      canAskAgain: true,
    };
  }

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'カメラ権限の許可',
            message: 'この機能を使用するにはカメラへのアクセスが必要です。',
            buttonPositive: '許可',
            buttonNegative: '拒否',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    // iOS handles permissions automatically through launchCamera
    return true;
  }

  async captureImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
        cameraType: 'back',
        includeBase64: false,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          reject(new Error('ユーザーがキャンセルしました'));
        } else if (response.errorCode) {
          console.error('Camera error:', response.errorMessage);
          reject(new Error(response.errorMessage || 'カメラエラーが発生しました'));
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.uri) {
            resolve(asset.uri);
          } else {
            reject(new Error('画像のURIが取得できませんでした'));
          }
        } else {
          reject(new Error('画像の取得に失敗しました'));
        }
      });
    });
  }
}
