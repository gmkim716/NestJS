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
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor) // class transformer를 사용한다는 걸 명시해야 한다
@UsePipes(ValidationPipe)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // 파이프를 이용해 title 입력값에 대한 검증
  @Get()
  getMovies(@Query('title', MovieTitleValidationPipe) title: string) {
    return this.movieService.findAll(title);
  }

  // ParseIntPipe: 입력값이 숫자인지 검증, 기본 메시지를 수정하고 싶으면 두번째 인자로 넣어준다
  @Get(':id')
  getOneMovie(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException('숫자를 입력해주세요!');
        },
      }),
    )
    id: string,
  ) {
    return this.movieService.findOne(+id); // +id: string이 아닌 number로 변환하기 위해서
  }

  @Post()
  postMovie(@Body() body: CreateMovieDto) {
    return this.movieService.create(body);
  }

  @Patch(':id')
  updateMovie(
    @Param('id', ParseIntPipe) id: string,
    @Body() body: UpdateMovieDto,
  ) {
    return this.movieService.update(+id, body);
  }

  @Delete(':id')
  deleteMovie(@Param('id', ParseIntPipe) id: string) {
    return this.movieService.delete(+id);
  }
}
