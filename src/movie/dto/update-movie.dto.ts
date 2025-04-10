import { CreateMovieDto } from './create-movie.dto';
import { PartialType } from '@nestjs/mapped-types';

// PartialType을 적용하면아 아래 내용을 작성하지 않아도 됨
export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  // // @IsOptional(), @IsNotEmpty()를 동시에 사용하면 ""과 같이 비어있는 string의 전달을 방지할 수 있다
  // @IsOptional() // 필수 필드가 아니라면 선택적으로 사용할 수 있도록 설정
  // @IsNotEmpty()
  // @IsString()
  // title?: string;
  // @IsOptional()
  // @ArrayNotEmpty()
  // @IsArray()
  // @IsNumber({}, { each: true })
  // genreIds?: number[];
  // @IsOptional()
  // @IsNotEmpty() // tip. ?을 입력해서 타입 안정성을 높이지만, 유효성 처리는 어노테이션을 통해서 진행
  // @IsString()
  // detail?: string;
  // @IsOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // directorId?: number;
}
