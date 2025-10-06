import { ImageTempStore } from '../src/infrastructure/storage/ImageTempStore';

describe('ImageTempStore', () => {
  let store: ImageTempStore;

  beforeEach(() => {
    store = new ImageTempStore();
  });

  it('should save and retrieve image metadata', async () => {
    const imageId = 'test_image_1';
    const userId = 'user_123';
    const filePath = '/tmp/test_image.jpg';

    const metadata = await store.saveImage(imageId, userId, filePath);

    expect(metadata.id).toBe(imageId);
    expect(metadata.userId).toBe(userId);
    expect(metadata.filePath).toBe(filePath);
    expect(metadata.capturedAt).toBeInstanceOf(Date);

    const retrieved = await store.getImage(imageId);
    expect(retrieved).toEqual(metadata);
  });

  it('should delete image metadata', async () => {
    const imageId = 'test_image_2';
    await store.saveImage(imageId, 'user_123', '/tmp/test.jpg');

    await store.deleteImage(imageId);

    const retrieved = await store.getImage(imageId);
    expect(retrieved).toBeNull();
  });

  it('should cleanup old images', async () => {
    const oldImageId = 'old_image';
    const metadata = await store.saveImage(
      oldImageId,
      'user_123',
      '/tmp/old.jpg',
    );

    // Manually set old date
    metadata.capturedAt = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

    await store.cleanupOldImages(24); // cleanup images older than 24 hours

    const retrieved = await store.getImage(oldImageId);
    expect(retrieved).toBeNull();
  });
});
