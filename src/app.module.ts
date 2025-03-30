import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// IoC 컨테이너에 관리될 클래스들을 모아두는 곳
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: true, // 개발할 때만 true 적용, 자동으로 코드와 DB를 동기화 적용
    }),
    MovieModule,
  ], // CLI로 생성한 모듈이 자동으로 추가됨
})
export class AppModule {}
