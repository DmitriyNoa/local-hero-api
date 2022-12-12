import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`-----app is listening on port ${port}-----`);
}
bootstrap();
