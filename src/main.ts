import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);
  // await app.listen(process.env.PORT ?? 3000, () => {
  //   console.log(`app running on port http://localhost:${process.env.PORT}`);
  // });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 App running at http://localhost:${port}`);
}
bootstrap();
