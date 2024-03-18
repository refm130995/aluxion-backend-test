import { FilesService } from "../files/files.service";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UnsplashService } from "./unsplash.service";

@ApiTags("unsplash")
@Controller("unsplash")
export class UnsplashController {
  constructor(
    private unsplashService: UnsplashService,
    private filesService: FilesService
  ) {}

  @Get("search")
  @ApiOperation({ summary: "Search images on Unsplash" })
  @ApiQuery({ name: "query", type: String, description: "Search query term for images" })
  @ApiResponse({ status: 200, description: "Search completed successfully." })
  @ApiResponse({ status: 400, description: "Invalid query parameters." })
  async searchImages(@Query("query") query: string) {
    return await this.unsplashService.searchImages(query);
  }

  @Post("upload-unsplash-to-s3")
  @ApiOperation({ summary: "Upload an image from Unsplash directly to AWS S3" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query term for the image" },
        bucketName: { type: "string", description: "The S3 bucket name where the image will be uploaded" },
        fileName: { type: "string", description: "The file name under which the image will be stored in the bucket" }
      }
    }
  })
  @ApiResponse({ status: 200, description: "Image uploaded successfully to S3." })
  @ApiResponse({ status: 400, description: "Invalid request body." })
  async uploadUnsplashImageToS3(@Body() body: { query: string; bucketName: string; fileName: string }) {
    const imageUrl = await this.unsplashService.getPhotoDownloadUrl(body.query);
    await this.filesService.uploadFromUrlToS3(imageUrl, body.bucketName, body.fileName);
    return { message: "Image uploaded successfully to S3", imageUrl };
  }
}
