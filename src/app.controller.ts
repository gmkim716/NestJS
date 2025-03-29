import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

interface Movie {
  id: number;
  title: string;
}

@Controller('movie')
export class AppController {
  constructor(private readonly appService: AppService) {}

  private movies: Movie[] = [
    { id: 1, title: '해리포터' },
    { id: 2, title: '어밴져스' },
    { id: 3, title: '주디안' },
  ];

  private idCounter = 3;

  @Get()
  getMovies(@Query('title') title: string) {
    if (!title) {
      return this.movies;
    }

    return this.movies.filter((m) => m.title.startsWith(title));
  }

  @Get(':id')
  getOneMovie(@Param('id') id: string) {
    const movie = this.movies.find((m) => m.id === +id); // +id: string이 아닌 number로 변환하기 위해서

    if (!movie) {
      // NotFoundException: 404 에러를 발생시켜 클라이언트의 호출 오류임을 전달
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    return movie;
  }

  @Post()
  postMovie(@Body('title') title: string) {
    const movie: Movie = {
      id: this.idCounter++,
      title: title,
    };

    this.movies.push(movie);
    return movie;
  }

  @Patch(':id')
  patchMovie(@Param('id') id: string, @Body('title') title: string) {
    const movie = this.movies.find((m) => m.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    // Obejct.assign: 첫번째 인자에 두번째 인자의 값을 넣어준다.
    Object.assign(movie, { title });

    return movie;
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    const movieIdx = this.movies.findIndex((m) => m.id === +id);

    if (movieIdx === -1) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    // splice: 배열의 특정 요소를 제거
    this.movies.splice(movieIdx, 1);

    return id;
  }
}
