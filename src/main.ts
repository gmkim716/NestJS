import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 기본값: false, true로 설정하면 정의하지 않은 프로퍼티 값을 제거
      forbidNonWhitelisted: true, // 기본값 false, 있으면 안되는 프로퍼티가 존재할 때 에러 반환
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
