import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Bank API-')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'API BANK-')
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addTag('wallets')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);

  // Use PORT from environment variables or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/${process.env.SWAGGER_PATH || 'api'}`,
  );
}
// Handle the Promise returned by bootstrap()
bootstrap().catch((error) => {
  console.error('An error occurred during bootstrap:', error);
  process.exit(1);
});
