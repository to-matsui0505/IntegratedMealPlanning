export interface ImageMetadata {
  id: string;
  userId: string;
  capturedAt: Date;
  filePath: string;
}

export class ImageTempStore {
  private images: Map<string, ImageMetadata> = new Map();

  async saveImage(
    imageId: string,
    userId: string,
    filePath: string,
  ): Promise<ImageMetadata> {
    const metadata: ImageMetadata = {
      id: imageId,
      userId,
      capturedAt: new Date(),
      filePath,
    };
    this.images.set(imageId, metadata);
    return metadata;
  }

  async getImage(imageId: string): Promise<ImageMetadata | null> {
    return this.images.get(imageId) || null;
  }

  async deleteImage(imageId: string): Promise<void> {
    this.images.delete(imageId);
    // TODO: Implement actual file deletion logic
  }

  async cleanupOldImages(maxAgeHours: number = 24): Promise<void> {
    const now = new Date();
    const imagesToDelete: string[] = [];

    this.images.forEach((metadata, id) => {
      const ageInHours =
        (now.getTime() - metadata.capturedAt.getTime()) / (1000 * 60 * 60);
      if (ageInHours > maxAgeHours) {
        imagesToDelete.push(id);
      }
    });

    for (const id of imagesToDelete) {
      await this.deleteImage(id);
    }
  }
}
