// Mock for react-native-vision-camera
export const Camera = {
  getAvailableCameraDevices: jest.fn(async () => [
    {
      id: 'mock-camera',
      position: 'back',
      hasFlash: true,
    },
  ]),
  getCameraPermissionStatus: jest.fn(async () => 'granted'),
  requestCameraPermission: jest.fn(async () => 'granted'),
};

export const useCameraDevice = jest.fn(() => ({
  id: 'mock-camera',
  position: 'back',
  hasFlash: true,
}));

export const useCameraPermission = jest.fn(() => ({
  hasPermission: true,
  requestPermission: jest.fn(async () => true),
}));

export default Camera;
