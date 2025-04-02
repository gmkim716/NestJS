import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { MovieDetail } from './movie-detail.entity';
import { Director } from 'src/director/entities/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';

// ManyToOne Director: 감독은 여러 개의 영화를 만들 수 있음
// OneToOne MovieDetail: 영화는 하나의 상세 내용을 가질 수 있음
// ManyToMany Genre: 영화는 여러 개의 장르를 가질 수 있고, 장르는 여러 개의 영화를 가질 수 있음

@Entity()
export class Movie extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true, // 중복 방지
  })
  title: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.id, {
    cascade: true, // 영화를 생성하면 상세 내용도 함께 생성
    nullable: false, // null값 방지, 영화가 생성되면 상세 내용도 함께 생성
  })
  @JoinColumn()
  detail: MovieDetail;

  @ManyToOne(() => Director, (director) => director.id, {
    cascade: true,
    nullable: true, // 임시로 true로 변경
  })
  @JoinColumn()
  director: Director;
}
