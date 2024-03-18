
import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './../files.controller';

import * as dotenv from 'dotenv';
import { Readable } from 'stream';
import { FilesModule } from '../files.module';
import { FilesService } from '../files.service';
dotenv.config();

describe('FilesService', () => {
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
                        getSignedUrl: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<FilesController>(FilesController);
        filesService = module.get<FilesService>(FilesService);
    });

    describe('uploadFile', () => {
        it('should upload a file to S3 successfully', async () => {
            const mockStream = new Readable();
            mockStream._read = () => { };
            mockStream.push('simulate content');
            mockStream.push(null);
            const mockFile: Express.Multer.File = {
                fieldname: 'file',
                originalname: 'test.txt',
                encoding: '7bit',
                mimetype: 'text/plain',
                destination: './uploads',
                filename: 'test.txt',
                path: './uploads/test.txt',
                size: 1024,
                stream: mockStream,
                buffer: Buffer.from('simulate content'),

            };
            const bucketName = process.env.AWS_S3_BUCKET_NAME;
            const result = await filesService.uploadFile(mockFile, bucketName);
            expect(result).toBeDefined();
        });
    });

    describe('getSignedUrl', () => {
        it('should return a signed URL for a file', async () => {
            const bucketName = process.env.AWS_S3_BUCKET_NAME;
            const fileName = 'test.txt';

            const result = await filesService.getSignedUrl(bucketName, fileName);
            expect(result).toBeDefined();
        });
    });

    // describe('renameFile', () => {
    //     it('should rename a file in S3 by copying and deleting', async () => {
    //         const bucketName = process.env.AWS_S3_BUCKET_NAME;
    //         const oldFileName = 'test';
    //         const newFileName = 'new-test.txt';




    //         await filesService.renameFile(bucketName, oldFileName, newFileName);
    //     });
    // });

});
