import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

export interface Movie {
  id: number;
  title: string;
  genres: string[];
}

@Injectable()
export class MovieService {
  private movies: Movie[] = [
    { id: 1, title: '해리포터', genres: ['판타지', '모험'] },
    { id: 2, title: '어밴져스', genres: ['액션', '모험'] },
  ];

  private idCounter = 3;

  getManyMovies(title?: string): Movie[] {
    if (!title) {
      return this.movies;
    }

    return this.movies.filter((m) => m.title.startsWith(title));
  }

  getMovieById(id: number): Movie {
    const movie = this.movies.find((m) => m.id === id);
    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    return movie;
  }

  createMovie(createMovieDto: CreateMovieDto): Movie {
    const movie: Movie = {
      id: this.idCounter++,
      ...createMovieDto, // 스프레드 연산자로 더 간단하게 표기하기
    };

    this.movies.push(movie);
    return movie;
  }

  updateMovie(id: number, updateMovieDto: UpdateMovieDto): Movie {
    const movie = this.movies.find((m) => m.id === +id);
    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    Object.assign(movie, updateMovieDto); // Object.assign(): 첫 번째 인자로 전달된 객체에 두 번째 인자로 전달된 객체의 속성을 복사

    return movie;
  }

  deleteMovie(id: number): boolean {
    this.getMovieById(id);
    this.movies.splice(id, 1);
    return true;
  }
}
