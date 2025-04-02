import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { Director } from './entities/director.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movie/entities/movie.entity';

@Module({
  imports: [
    // 모듈 내부에서 사용할 엔티티 등록
    TypeOrmModule.forFeature([Director, Movie]),
  ],
  controllers: [DirectorController],
  providers: [DirectorService],
})
export class DirectorModule {}
