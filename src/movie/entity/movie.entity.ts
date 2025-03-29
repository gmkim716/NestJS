import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude() // 클래스 전체에 두면 외부에 노출되지 않아야 하는 모든 필드에 두어야 한다
export class Movie {
  @Expose() // 직렬화 시 포함: JSON 형식으로 변환 시 포함
  id: number;

  @Expose()
  title: string;

  // @Exclude() // 직렬화 시 제외: JSON 형식으로 변환 시 제외
  // @Expose()
  @Transform(({ value }) => 'code factory')
  genres: string[];

  @Expose()
  get description() {
    return `id: ${this.id}, title: ${this.title}, genres: ${this.genres.join(', ')}`;
  }
}
