import { InputCameraScreen } from '../src/presentation/screens/InputCameraScreen';

describe('InputCameraScreen', () => {
  it('should be defined', () => {
    expect(InputCameraScreen).toBeDefined();
  });

  it('should be a React component', () => {
    expect(typeof InputCameraScreen).toBe('function');
  });
});
