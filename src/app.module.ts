import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { EmailService } from "./email/email.service";
import { FilesModule } from "./files/files.module";
import { UnsplashController } from "./unsplash/unsplash.controller";
import { UnsplashModule } from "./unsplash/unsplash.module";
import { UnsplashService } from "./unsplash/unsplash.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), UsersModule, AuthModule, UnsplashModule, FilesModule],
  controllers: [UnsplashController],
  providers: [UnsplashService, EmailService]
})
export class AppModule {}
