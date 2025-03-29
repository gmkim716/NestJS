import { Injectable, NotFoundException } from '@nestjs/common';

export interface Movie {
  id: number;
  title: string;
}

@Injectable()
export class MovieService {
  private movies: Movie[] = [
    { id: 1, title: '해리포터' },
    { id: 2, title: '어밴져스' },
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

  createMovie(title: string): Movie {
    const movie: Movie = {
      id: this.idCounter++,
      title: title,
    };

    this.movies.push(movie);
    return movie;
  }

  updateMovie(id: number, title: string): Movie {
    const movie = this.getMovieById(id);
    movie.title = title;
    return movie;
  }

  deleteMovie(id: number): boolean {
    this.getMovieById(id);
    this.movies.splice(id, 1);
    return true;
  }
}
