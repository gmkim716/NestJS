import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  // @IsOptional(), @IsNotEmpty()를 동시에 사용하면 ""과 같이 비어있는 string의 전달을 방지할 수 있다

  @IsOptional() // 필수 필드가 아니라면 선택적으로 사용할 수 있도록 설정
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  genres?: string[];
}
