import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Like, Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieDetail } from './entities/movie-detail.entity';
import { Director } from 'src/director/entities/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';

@Injectable()
export class MovieService {
  private idCounter = 3;
  private movies: Movie[] = [];

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async findAll(title?: string) {
    if (!title) {
      return [
        await this.movieRepository.find({
          relations: ['director'],
        }),
        await this.movieRepository.count(),
      ];
    }

    return this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      relations: ['director'],
    });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      // 리스트로 값을 넣을 수 있다. 가져오고 싶은 관계를 넣는다
      relations: ['detail', 'director'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: { id: createMovieDto.directorId },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID 값의 감독입니다');
    }

    const genres = await this.genreRepository.find({
      where: { id: In(createMovieDto.genreIds) }, // in: 여러개의 값을 받을 때 사
    });

    if (genres.length !== createMovieDto.genreIds.length) {
      throw new NotFoundException('존재하지 않는 장르가 있습니다');
    }

    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      detail: {
        detail: createMovieDto.detail,
      }, // movieDetail 연결
      genres,
    });

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

    let newDirector: Director | undefined;
    let newGenres: Genre[] | undefined;

    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: { id: directorId },
      });

      if (!director) {
        throw new NotFoundException('존재하지 않는 ID 값의 감독입니다');
      }

      newDirector = director;
    }

    if (genreIds) {
      newGenres = await this.genreRepository.find({
        where: { id: In(genreIds) },
      });

      if (newGenres.length !== genreIds.length) {
        throw new NotFoundException('존재하지 않는 장르가 있습니다');
      }
    }

    const movieUpdateFields: Partial<Movie> = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
      ...(newGenres && { genres: newGenres }),
    };

    await this.movieRepository.update({ id }, movieUpdateFields);

    if (detail) {
      await this.movieDetailRepository.update(
        { id: movie.detail.id },
        { detail },
      );
    }

    const newMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'genres'],
    });

    if (!newMovie) {
      throw new NotFoundException('영화 업데이트 중 오류가 발생했습니다');
    }

    if (newGenres) {
      newMovie.genres = newGenres;
    }

    await this.movieRepository.save(newMovie);
    return this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'genres', 'director'],
    });
  }

  async delete(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
    }

    await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete(movie.detail.id);
    return id;
  }
}
