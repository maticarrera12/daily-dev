import type { ImageStorage } from "../../src/application/ports/ImageStorage";

export class FakeImageStorage implements ImageStorage {
  copiedFrom: string[] = [];
  deletedPaths: string[] = [];
  private nextManagedPath = 1;
  private shouldFailCopy = false;

  async copy(sourcePath: string): Promise<string> {
    if (this.shouldFailCopy) {
      throw new Error(`Failed to copy image from ${sourcePath}`);
    }
    this.copiedFrom.push(sourcePath);
    return `/managed/habit-images/${this.nextManagedPath++}.png`;
  }

  async delete(imagePath: string): Promise<void> {
    this.deletedPaths.push(imagePath);
  }

  // Test helper
  failNextCopy(): void {
    this.shouldFailCopy = true;
  }
}
