import { CameraDevice } from '../src/interfaces/camera/CameraDevice';

describe('CameraDevice', () => {
  let device: CameraDevice;

  beforeEach(() => {
    device = new CameraDevice();
  });

  it('should check camera permission', async () => {
    const status = await device.checkPermission();

    expect(status).toBeDefined();
    expect(typeof status.granted).toBe('boolean');
    expect(typeof status.canAskAgain).toBe('boolean');
  });

  it('should request camera permission', async () => {
    const result = await device.requestPermission();

    expect(typeof result).toBe('boolean');
  });

  it('should capture image and return path', async () => {
    const imagePath = await device.captureImage();

    expect(typeof imagePath).toBe('string');
    expect(imagePath.length).toBeGreaterThan(0);
  });
});
