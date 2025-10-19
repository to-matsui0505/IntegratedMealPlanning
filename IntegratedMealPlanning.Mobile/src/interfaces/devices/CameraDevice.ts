import * as ImagePicker from 'expo-image-picker';

/**
 * カメラデバイスインターフェース
 * カメラ撮影や画像選択の機能を提供
 */
export interface CameraDevice {
  /**
   * カメラで写真を撮影する
   * @returns 撮影した画像のURI、キャンセルした場合はnull
   */
  takePicture(): Promise<string | null>;

  /**
   * ギャラリーから画像を選択する
   * @returns 選択した画像のURI、キャンセルした場合はnull
   */
  pickImage(): Promise<string | null>;

  /**
   * カメラの権限をリクエストする
   * @returns 権限が付与されたかどうか
   */
  requestCameraPermission(): Promise<boolean>;

  /**
   * ギャラリーの権限をリクエストする
   * @returns 権限が付与されたかどうか
   */
  requestMediaLibraryPermission(): Promise<boolean>;
}

/**
 * Expo ImagePickerを使用したCameraDeviceの実装
 */
export class ExpoCameraDevice implements CameraDevice {
  async requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  async takePicture(): Promise<string | null> {
    // カメラ権限をチェック
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      throw new Error('カメラの権限が許可されていません');
    }

    // カメラを起動
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  }

  async pickImage(): Promise<string | null> {
    // ギャラリー権限をチェック
    const hasPermission = await this.requestMediaLibraryPermission();
    if (!hasPermission) {
      throw new Error('ギャラリーへのアクセス権限が許可されていません');
    }

    // ギャラリーから画像を選択
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  }
}
