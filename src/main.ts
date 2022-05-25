import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

if (!process.env.PORT) {
  process.exit(1);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}
bootstrap();
