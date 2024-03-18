import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  console.log(process.env.AWS_S3_BUCKET_NAME);

  const config = new DocumentBuilder()
    .setTitle("File Management API")
    .setDescription(
      "This API allows for file management with operations for uploading, downloading, and searching for images through Unsplash, designed for Aluxion by Ramón Figuera."
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("files", "Operations related to file management")
    .addTag("unsplash", "Operations related to searching for images on Unsplash")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
