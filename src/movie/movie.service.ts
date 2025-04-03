import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Repository, In, DataSource } from 'typeorm';
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

    // 트랜잭션 관리를 위한 DataSource
    private readonly dataSource: DataSource,
  ) {}

  async findAll(title?: string) {
    const qb = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres');

    if (title) {
      qb.where('movie.title LIKE :title', { title: `%${title}%` });
    }

    return await qb.getManyAndCount();

    // if (!title) {
    //   return [
    //     await this.movieRepository.find({
    //       relations: ['director'],
    //     }),
    //     await this.movieRepository.count(),
    //   ];
    // }

    // return this.movieRepository.findAndCount({
    //   where: {
    //     title: Like(`%${title}%`),
    //   },
    //   relations: ['director'],
    // });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .where('movie.id = :id', { id })
      .getOne();

    // const movie = await this.movieRepository.findOne({
    //   where: {
    //     id,
    //   },
    //   // 리스트로 값을 넣을 수 있다. 가져오고 싶은 관계를 넣는다
    //   relations: ['detail', 'director'],
    // });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect(); // 커넥션 연결
    await qr.startTransaction(); // 트랜잭션 시작

    // 트랜잭션 시 무조건 try catch 구문 사용
    try {
      const director = await qr.manager.findOne(Director, {
        where: { id: createMovieDto.directorId },
      });

      if (!director) {
        throw new NotFoundException('존재하지 않는 ID 값의 감독입니다');
      }

      const genres = await qr.manager.find(Genre, {
        where: { id: In(createMovieDto.genreIds) }, // in: 여러개의 값을 받을 때 사
      });

      if (genres.length !== createMovieDto.genreIds.length) {
        throw new NotFoundException('존재하지 않는 장르가 있습니다');
      }

      const movieDetail = await qr.manager
        .createQueryBuilder()
        .insert()
        .into(MovieDetail)
        .values({
          detail: createMovieDto.detail,
        })
        .execute();

      const movieDetailId = (movieDetail.identifiers[0] as { id: number }).id;

      const movie = await qr.manager
        .createQueryBuilder()
        .insert()
        .into(Movie)
        .values({
          title: createMovieDto.title,
          detail: { id: movieDetailId },
          director,
        })
        .execute();

      const movieId = (movie.identifiers[0] as { id: number }).id;

      await qr.manager
        .createQueryBuilder()
        .relation(Movie, 'genres')
        .of(movieId)
        .add(genres.map((genre) => genre.id));

      // const movie = await this.movieRepository.save({
      //   title: createMovieDto.title,
      //   detail: {
      //     detail: createMovieDto.detail,
      //   }, // movieDetail 연결
      //   genres,
      // });

      await qr.commitTransaction();

      // 트랜잭션이 종료된 시점이라서 qr.manager 사용하지 않아도 됨
      return await this.movieRepository.findOne({
        where: { id: movieId },
        relations: ['detail', 'genres', 'director'],
      });
    } catch (error) {
      await qr.rollbackTransaction();

      throw error;
    } finally {
      await qr.release();
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const movie = await qr.manager.findOne(Movie, {
        where: { id },
        relations: ['detail', 'genres'],
      });

      if (!movie) {
        throw new NotFoundException('존재하지 않는 ID 값의 영화입니다');
      }

      const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

      let newDirector: Director | undefined;
      let newGenres: Genre[] | undefined;

      if (directorId) {
        const director = await qr.manager.findOne(Director, {
          where: { id: directorId },
        });

        if (!director) {
          throw new NotFoundException('존재하지 않는 ID 값의 감독입니다');
        }

        newDirector = director;
      }

      if (genreIds) {
        newGenres = await qr.manager.find(Genre, {
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

      await qr.manager
        .createQueryBuilder()
        .update(Movie)
        .set(movieUpdateFields)
        .where('id = :id', { id })
        .execute();

      // await this.movieRepository.update({ id }, movieUpdateFields);

      if (detail) {
        await qr.manager
          .createQueryBuilder()
          .update(MovieDetail)
          .set({ detail })
          .where('id = :id', { id: movie.detail.id })
          .execute();

        // await this.movieDetailRepository.update(
        //   { id: movie.detail.id },
        //   { detail },
        // );
      }

      if (newGenres) {
        await qr.manager
          .createQueryBuilder()
          .relation(Movie, 'genres')
          .of(id)
          .addAndRemove(
            newGenres.map((genre) => genre.id),
            movie.genres.map((genre) => genre.id),
          );
      }

      // const newMovie = await this.movieRepository.findOne({
      //   where: { id },
      //   relations: ['detail', 'genres'],
      // });

      // if (!newMovie) {
      //   throw new NotFoundException('영화 업데이트 중 오류가 발생했습니다');
      // }

      // if (newGenres) {
      //   newMovie.genres = newGenres;
      // }

      // await this.movieRepository.save(newMovie);

      await qr.commitTransaction();

      return this.movieRepository.findOne({
        where: { id },
        relations: ['detail', 'genres', 'director'],
      });
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async delete(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
    }

    await this.movieRepository
      .createQueryBuilder()
      .delete()
      .from(Movie)
      .where('id = :id', { id })
      .execute();

    await this.movieDetailRepository
      .createQueryBuilder()
      .delete()
      .from(MovieDetail)
      .where('id = :id', { id: movie.detail.id })
      .execute();

    // await this.movieRepository.delete(id);
    // await this.movieDetailRepository.delete(movie.detail.id);
    return id;
  }
}
