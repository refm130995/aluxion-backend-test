import { Module } from "@nestjs/common";
import { FilesModule } from "src/files/files.module";
import { UnsplashController } from "./unsplash.controller";
import { UnsplashService } from "./unsplash.service";

@Module({
  imports: [FilesModule],
  providers: [UnsplashService],
  controllers: [UnsplashController],
  exports: []
})
export class UnsplashModule {}
