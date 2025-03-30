import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';

@Injectable()
export class MovieService {
  private idCounter = 3;
  private movies: Movie[] = [];

  constructor() {
    // 기본값 생성
    const movie1 = new Movie();
    movie1.id = 1;
    movie1.title = '해리포터';
    movie1.genre = '판타지';

    const movie2 = new Movie();
    movie2.id = 2;
    movie2.title = '어밴져스';
    movie2.genre = '액션';

    this.movies.push(movie1, movie2);
  }

  getManyMovies(title?: string): Movie[] {
    console.log(this.movies); // genres가 출력되지 않음

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

  createMovie(createMovieDto: CreateMovieDto) {
    const movie: Movie = {
      id: this.idCounter++,
      ...createMovieDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
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
