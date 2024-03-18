import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, HttpStatus, HttpException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiParam } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a file to AWS S3" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: HttpStatus.OK, description: "The file has been uploaded successfully." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid request." })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const uploadResult = await this.filesService.uploadFile(file, bucketName);

      return { message: "The file has been uploaded successfully.", uploadResult };
    } catch (error) {
      throw new HttpException("Failed to upload the file.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("signed-url/:fileName")
  @ApiOperation({ summary: "Gets a signed URL for a file on AWS S3" })
  @ApiParam({ name: "fileName", description: "Name of the file to generate the signed URL for", type: String })
  @ApiResponse({ status: HttpStatus.OK, description: "Signed URL generated successfully." })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "File not found." })
  getSignedUrl(@Param("fileName") fileName: string) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    return this.filesService.getSignedUrl(bucketName, fileName);
  }
}
