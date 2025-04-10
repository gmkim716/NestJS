import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// 파이프를 만들 때는 PipeTransform을 implement 해야 한다, <string, string>: 입력값의 타입과 출력값의 타입을 지정해준다
@Injectable() // 파이프는 모든 요청에서 실행되기 때문에 Injectable 데코레이터를 붙여줘야 한다
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      return value;
    }

    // 만약에 글자 길이가 2보다 작으면 에러 던지기!
    if (value.length < 2) {
      throw new BadRequestException('영화 제목은 3자 이상 작성해주세요');
    }

    return value;
  }
}
