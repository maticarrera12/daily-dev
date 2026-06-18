export interface ImageStorage {
  /**
   * Copies the image at `sourcePath` into the app's managed image
   * directory and returns the new managed path. Must throw on failure
   * (e.g. unreadable source file, disk error) — callers rely on the
   * rejection to avoid persisting a habit with a missing image.
   */
  copy(sourcePath: string): Promise<string>;

  /**
   * Deletes a previously copied image by its managed path. Used when an
   * image is replaced (edit flow) to avoid orphaned files on disk.
   */
  delete(imagePath: string): Promise<void>;
}
