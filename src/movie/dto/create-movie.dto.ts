import {
  Contains,
  Equals,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsCreditCard,
  IsDateString,
  IsDefined,
  IsDivisibleBy,
  IsEmpty,
  IsEnum,
  IsHexColor,
  IsIn,
  IsInt,
  IsLatLong,
  IsNegative,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotContains,
  NotEquals,
  registerDecorator,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

enum MovieGenre {
  HORROR = 'horror',
  COMEDY = 'comedy',
  ACTION = 'action',
}

@ValidatorConstraint()
class PasswordValidator implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    // 비밀번호 길이는 4-8자리여야 한다
    return value.length > 4 && value.length < 8;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return '비밀번호의 길이는 4-8자리여야 합니다. 입력된 비밀번호: $value';
  }
}

function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: PasswordValidator,
    });
  };
}

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  genre: string;

  // @IsDefined() // null이나 undefined가 아니어야 한다
  // @IsOptional() // 필수 필드가 아니라면 선택적으로 사용할 수 있도록 설정
  // @Equals('hello') // 값이 hello인지 검증
  // @NotEquals('world') // 값이 world가 아닌지 검증
  // @IsEmpty() // null | undefined | '' | [] | {}, 비어있는지 검증
  // @IsNotEmpty() // null | undefined | '' | [] | {}, 비어있지 않은지 검증

  // Array
  // @IsIn(['horror', 'comedy', 'action']) // 배열 안에 있는 값인지 검증
  // @IsNotIn(['horror', 'comedy', 'action']) // 배열 안에 있는 값이 아닌지 검증

  // Type
  // @IsBoolean() // boolean 타입인지 검증
  // @IsString() // string 타입인지 검증
  // @IsNumber() // number 타입인지 검증
  // @IsInt() // integer 타입인지 검증
  // @IsArray() // array 타입인지 검증
  // @IsEnum(MovieGenre) // enum 타입인지 검증

  // 날짜
  // @IsDateString() // 날짜 타입인지 검증

  // 숫자
  // @IsDivisibleBy(n) // n로 나누어 떨어지는지 검증
  // @IsPositive() // 양수인지 검증
  // @IsNegative() // 음수인지 검증
  // @Min(1) // 최소값 검증
  // @Max(10) // 최대값 검증

  // 문자
  // @Contains('hello') // 문자열에 hello가 포함되어 있는지 검증
  // @NotContains('hello') // 문자열에 hello가 포함되어 있지 않은지 검증
  // @IsAlphanumeric() // 문자열이 알파벳과 숫자로만 이루어져 있는지 검증, 한글을 포함한 특수기호는 안됨
  // @IsCreditCard() // 신용카드 번호(0000-0000-0000-0000)인지 검증
  // @IsHexColor() // 16진수 색상 코드(ffffff)인지 검증
  // @MaxLength(10) // 최대 길이 검증
  // @MinLength(10) // 최소 길이 검증
  // @IsUUID() // UUID 형식(123e4567-e89b-12d3-a456-426614174000)인지 검증
  // @IsLatLong() // 위도와 경도 형식(123.456, 78.910)인지 검증

  // @Validate(PasswordValidator, {
  //   message: '기본으로 설정한 에러메시지를 무시하고 다른 메시지를 전달합니다',
  // })
  @IsPasswordValid({
    message: '기본으로 설정한 에러메시지를 무시하고 다른 메시지를 전달합니다',
  })
  test: string;

  description: string;
}
