import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';

@Module({
  imports: [
    // forFeature 사용, TypeORM에서 Movie repository를 만들어서 사용하려는 곳에 IoC 컨테이너가 인젝트를 진행한다
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
