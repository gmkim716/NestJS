import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';

// IoC 컨테이너에 관리될 클래스들을 모아두는 곳
@Module({
  imports: [MovieModule], // CLI로 생성한 모듈이 자동으로 추가됨
})
export class AppModule {}
