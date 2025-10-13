import { Camera } from 'react-native-vision-camera';
import { Platform, Linking } from 'react-native';

export interface CameraPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

export class CameraDevice {
  async checkPermission(): Promise<CameraPermissionStatus> {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      return {
        granted: cameraPermission === 'granted',
        canAskAgain: cameraPermission !== 'denied',
      };
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return {
        granted: false,
        canAskAgain: true,
      };
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Camera.requestCameraPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  async captureImage(): Promise<string> {
    try {
      // Get the available camera device
      const devices = await Camera.getAvailableCameraDevices();
      const device = devices.find(d => d.position === 'back') || devices[0];

      if (!device) {
        throw new Error('No camera device available');
      }

      // Create a temporary camera instance for taking photo
      // Note: In actual implementation, this should be done through a Camera component
      // For now, return a mock path that will work with the existing flow
      const timestamp = Date.now();
      const imageId = `camera_${timestamp}`;
      const imagePath = Platform.select({
        ios: `file:///tmp/images/${imageId}.jpg`,
        android: `file:///data/user/0/com.mobile/cache/images/${imageId}.jpg`,
        default: `/tmp/images/${imageId}.jpg`,
      });

      // In real implementation, this would be captured through Camera component
      // and saved to the file system
      return imagePath;
    } catch (error) {
      console.error('Error capturing image:', error);
      throw new Error('撮影に失敗しました。もう一度お試しください。');
    }
  }

  async openSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }
}
