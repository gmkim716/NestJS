import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// IoC 컨테이너에 관리될 클래스들을 모아두는 곳
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [],
      synchronize: true, // 개발할 때만 true 적용, 자동으로 코드와 DB를 동기화 적용
    }),
    MovieModule,
  ], // CLI로 생성한 모듈이 자동으로 추가됨
})
export class AppModule {}
