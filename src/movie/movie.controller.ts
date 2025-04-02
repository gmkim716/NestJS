import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor) // class transformer를 사용한다는 걸 명시해야 한다
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getMovies(@Query('title') title: string) {
    return this.movieService.findAll(title);
  }

  @Get(':id')
  getOneMovie(@Param('id') id: string) {
    return this.movieService.findOne(+id); // +id: string이 아닌 number로 변환하기 위해서
  }

  @Post()
  postMovie(@Body() body: CreateMovieDto) {
    return this.movieService.create(body);
  }

  @Patch(':id')
  updateMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.movieService.update(+id, body);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.delete(+id);
  }
}
