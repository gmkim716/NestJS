import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, MovieDetail])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
