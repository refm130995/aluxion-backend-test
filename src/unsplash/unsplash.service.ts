import { Injectable } from "@nestjs/common";
import { createApi } from "unsplash-js";
@Injectable()
export class UnsplashService {
  private unsplashClient;
  constructor() {
    this.unsplashClient = createApi({
      accessKey: process.env.UNSPLASH_ACCESSKEY
    });
  }
  async searchImages(query: string) {
    try {
      const results = await this.unsplashClient.search.getPhotos({ query: query, orientation: "landscape" });
      if (results.type === "success") {
        return results.response.results;
      } else {
        throw new Error("Failed to fetch Unsplash images");
      }
    } catch (error) {
      console.log("something went wrong!");
    }
  }

  async getPhotoDownloadUrl(query: string): Promise<string> {
    const results = await this.searchImages(query);
    if (results.length > 0) {
      return results[0].urls.full;
    } else {
      throw new Error("No images found.");
    }
  }
}
