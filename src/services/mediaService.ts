import { get, set, del } from "idb-keyval";

export interface MediaAsset {
  id: string;
  name: string;
  url: string; // Base64 or external URL
  mimeType: string;
  size: number;
  alt: string;
  createdAt: string;
}

const MEDIA_KEY = "cms_media_library";

export class MediaService {
  async getAll(): Promise<MediaAsset[]> {
    try {
      return (await get<MediaAsset[]>(MEDIA_KEY)) || [];
    } catch {
      return [];
    }
  }

  async save(asset: MediaAsset): Promise<void> {
    const list = await this.getAll();
    const updated = [asset, ...list.filter((m) => m.id !== asset.id)];
    await set(MEDIA_KEY, updated);
  }

  async delete(id: string): Promise<void> {
    const list = await this.getAll();
    await set(
      MEDIA_KEY,
      list.filter((m) => m.id !== id)
    );
  }
}

export const mediaService = new MediaService();
