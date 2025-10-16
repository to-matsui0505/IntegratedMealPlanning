export const launchCamera = jest.fn((options, callback) => {
  // Mock successful camera capture
  const mockResponse = {
    didCancel: false,
    errorCode: null,
    errorMessage: null,
    assets: [
      {
        uri: 'file:///mock/path/to/image.jpg',
        fileName: 'mock_image.jpg',
        type: 'image/jpeg',
        fileSize: 123456,
        width: 1920,
        height: 1080,
      },
    ],
  };
  callback(mockResponse);
});

export const launchImageLibrary = jest.fn((options, callback) => {
  const mockResponse = {
    didCancel: false,
    errorCode: null,
    errorMessage: null,
    assets: [
      {
        uri: 'file:///mock/path/to/image.jpg',
        fileName: 'mock_image.jpg',
        type: 'image/jpeg',
        fileSize: 123456,
        width: 1920,
        height: 1080,
      },
    ],
  };
  callback(mockResponse);
});
