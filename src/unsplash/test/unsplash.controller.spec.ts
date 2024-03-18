import { FilesService } from "../../files/files.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UnsplashController } from "../unsplash.controller";
import { UnsplashService } from "../unsplash.service";
import * as dotenv from "dotenv";
dotenv.config();
describe("UnsplashController", () => {
  let controller: UnsplashController;
  let unsplashService: UnsplashService;
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnsplashController],
      providers: [
        UnsplashService,
        {
          provide: FilesService,
          useValue: {
            uploadFromUrlToS3: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UnsplashController>(UnsplashController);
    unsplashService = module.get<UnsplashService>(UnsplashService);
    filesService = module.get<FilesService>(FilesService);
  });

  it("should return search results", async () => {
    const query = "cats";
    const results = await controller.searchImages(query);
    expect(results).toBeDefined();
    expect(results[0].urls).toBeDefined();
  });

  it("should upload image to S3 and return success message", async () => {
    const body = { query: "cats", bucketName: process.env.AWS_S3_BUCKET_NAME, fileName: "cat.jpg" };
    const result = await controller.uploadUnsplashImageToS3(body);
    expect(result).toBeDefined();
    expect(result.message).toEqual("Image uploaded successfully to S3");
    expect(result.imageUrl).toBeDefined();
  });
});
