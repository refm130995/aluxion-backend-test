import { Test, TestingModule } from "@nestjs/testing";
import { FilesController } from "./../files.controller";

import * as dotenv from "dotenv";
import { Readable } from "stream";
import { FilesModule } from "../files.module";
import { FilesService } from "../files.service";
dotenv.config();
describe("FilesController", () => {
  let controller: FilesController;
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FilesModule],
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            uploadFile: jest.fn(),
            getSignedUrl: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
  });

  describe("uploadFile", () => {
    it("should call uploadFile with the correct parameters", async () => {
      const mockStream = new Readable();
      mockStream._read = () => {};
      mockStream.push("simulate content");
      mockStream.push(null);

      const mockFile: Express.Multer.File = {
        fieldname: "file",
        originalname: "test.txt",
        encoding: "7bit",
        mimetype: "text/plain",
        destination: "./uploads",
        filename: "test.txt",
        path: "./uploads/test.txt",
        size: 1024,
        stream: mockStream,
        buffer: Buffer.from("simulate content")
      };

      const result = await controller.uploadFile(mockFile);

      expect(result.message).toEqual("The file has been uploaded successfully.");
    });
  });

  describe("getSignedUrl", () => {
    it("should call getSignedUrl with the correct parameters", async () => {
      const fileName = "test-file.txt";

      const result = await controller.getSignedUrl(fileName);

      expect(result).toBeDefined();
    });
  });
});
