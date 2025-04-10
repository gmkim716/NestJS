# 코드팩토리 강의노트

# Mapped Types

- Mapped Types

  - createDto/updateDto에 중복해서 만들어야 할 번거로움을 덜어낼 수 있다

  - 5가지

    - partial: 클래스 프로퍼티 정의를 모두 optional로 만든다
    - pick: 특정 프로퍼티만 골라 사용할 수 있다 (omit의 반대)
    - omit: 특정 프로퍼티만 생걀할 수 있다 (pick의 반대)
    - intersection: 두 타입의 프로퍼티를 모두 모아서 사용할 수 있다
    - composition: Mapped Tyeps를 다양하게 조합해서 중첩 적용 가능하다

# Ch. 9 Pipe

## 파이프 이론

- Nestjs의 4가지 미들웨어 중 하나

### Pipe

- Controller에 제공되는 argument들에 적용. @Body, @Param등 이미 사용하고 있는 입력받는 Annotation들이 포함

  - 파이프는 argument 데이터를 가공한 후 Controller 메서드로 값을 넘겨준다

    - 컨트롤러의 메서드가 실행되기 전에 파이프가 실행된다는 뜻!

    - 파이프의 2가지 기능
      - transformation: 데이터를 원하는 형태로 변형
      - validation: 입력된 값이 정상적인 값인지 확인하고 아니면 에러를 전달

- Global pipe

  ```typescript
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipe(new ValdiationPipe()); // useGlobalPipe: 프로젝트 전ㅇ역에서 적용되도록 설정
  ```

- Controller Pipe

  - 컨트롤러에 적용하는 파이브

  ```typescript
  @Controller('movie')
  @UsePipes(new ValidationPipe())
  export class MovieController { ... }
  ```

- Route Pipe

  ```typescript
  @Controller('movie')
  export class MovieController {
    ...

    @Patch(':id')
    @UsePipes(new ValdiationPipe())
    patchMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) { ... }
  }
  ```

- Route Parameter Pipe

  ```typescript
  @Controller('movie')
  export class MovieController {
    ...

    @Patch(':id')
    @UsePipes(new ValdiationPipe())
    patchMovie(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMovieDto) { ... }
  }
  ```

- 기본 Pipe 타입

  - 값을 변환하고 검증
    - ValidationPipe
    - ParseIntPipe
    - ParseFloatPipe
    - ParseBoolPipe
    - ParseArrayPipe
    - ParseUUIDPipe
    - ParseEnumPipe
    - DefaultValuePipe
    - ParseFilePipe: 사용x

- 커스텀 pipe

  - Injecable()로 선언한다

  ```typescript
  @Injectable()
  export class ParseIntPipe implements PipeTransform<string, number> {
    transform( ... ) { ... }
  }
  ```

# Ch.8 데이터베이스 [250404]

- README ch-8.md 참고

# Ch.7 환경변수 [250330]

## 환경변수 이론

- 프로그램이 동작하는 환경에서의 설정값이나 비밀정보를 저장하고 사용하는 변수

- 중요성

  - [보안] API 키, 데이터베이스 비밀번호 등 민감한 정보를 코드에 직접 작성하지 않고 환경변수로 처리할 수 있다
  - [유연성] 애플리케이션을 다양한 환경 (개발, 테스트, 운영)에서 쉽게 설정하고 실행할 수 있도록 도와준다
  - [유지보수성] 설정 변경 시 코드수정 없이 환경변수 파일을 통해 간단히 업데이트할 수 있어 유지보수성을 노핀다
  - [통일성] 동일한 애플리케이션을 여러 환경에서 일관된 방식으로 배포하고 운영할 수 있도록 한다

- 환경변수 사용처

  - 데이터베이스 설정
  - PORT 번호
  - API 키
  - 환경 구분

1. 환경변수 사용: .env 파일

```text
DB_HOST=localhost
DB_PORT=5432
EXTERNAL_API_KEY=your-api-key
PORT=3000
NODE_ENV=development
SMTP_HOST=stmp.mailtrap.io
LOG_LEVEL=debug
```

2. 환경변수 모듈 등록: AppModule

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

3. 환경 변수 사용

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST');
  }

  getApiKey(): string {
    return this.configService.get<string>('EXTERNAL_API_KEY');
  }
}
```

# Ch.6 유효성 검사 및 변환 [250330]

## DTO(Data Transfer Obeject)

- body.x, body.y와 같이 사용 가능한 장점

## Class Validator

- 특성

  - 타입스크립트 decorator를 사용해 클래스를 검증
  - 동기 / 비동기 방식 모두 지원
  - \*class validator 자체적으로 제공하는 validator 사용 가능
  - 커스텀 validator을 쉽게 만들 수 있다
  - 커스텀 에러 메시지를 반환할 수 있다

- 적용 예제

  - @IsNotEmpty()
  - @IsEmail()

- 반환 에러 구조

  - target: 검증한 객체
  - property: 검증 실패한 프로퍼티
  - value: 검증 실패한 값
  - constraints: 검증 실패한 제약조건
  - children: 프로퍼티의 모든 검증 실패 제약조건

- 커스텀 에러 메시지

  - 데코레이터에 message를 추가하면 검증 실패했을 때의 에러메시지를 확인할 수 있다

### Class Validator 적용

1. 설치: `pnpm install class-validator class-transformer`
2. main.ts 등록: app.useGlobalPipe(new ValidationPipe())
3. dto에 class validator 등록

### 자주 사용하는 Class Validator 목록

- 기본

  - @IsDefined
  - @IsOptional
  - @Equals
  - @NotEquals
  - @IsEmpty
  - @IsNotEmpty
  - @IsIn
  - @IsNotIn

- 배열

  - @IsIn
  - @IsNotIn

- 타입

  - @IsBoolean()
  - @IsString()
  - @IsNumber()
  - @IsInt()
  - @IsArray()
  - @IsEnum(MovieGenre)

- 날짜

  - @IsDateString()

- 숫자

  - @IsDivisibleBy(n)
  - @IsPositive()
  - @IsNegative()
  - @Min(1)
  - @Max(10)

- 문자
  - @Contains('hello')
  - @NotContains('hello')
  - @IsAlphanumeric()
  - @IsCreditCard()
  - @IsHexColor()
  - @MaxLength(10)
  - @MinLength(10)
  - @IsUUID()
  - @IsLatLong()

### Custom Validator

- 하나의 함수와 하나의 클래스를 통해 만들 수 있다
- 직접 유효성 검사 어노테이션을 만들어 사용
- async: true를 설정하면 비동기로도 실행 가능
- 유지보수를 위해서 커스텀 클래스를 만들어 사용하는 방식을 권장

  - 비밀번호 유효성 검사

  ```typescript
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
      return '비밀번호의 길이는 4-8자리여야 합니다. ($value)';
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


  // @Validate(PasswordValidator, {
  //   message: '기본으로 설정한 에러메시지를 무시하고 다른 메시지를 전달합니다',
  // })

  @IsPasswordValid({
    message: '기본으로 설정한 에러메시지를 무시하고 다른 메시지를 전달합니다',
  })
  ```

### ValidationPipe

- main.ts의 useGlobalPipes에 옵션 추가가 가능

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // 기본값: false, true로 설정하면 정의하지 않은 프로퍼티 값을 제거
    forbidNonWhitelisted: true, // 기본값 false, 있으면 안되는 프로퍼티가 존재할 때 에러 반환
  }),
);
```

## Class Transformer

- 특성

  - TS Decorator를 이용해 클래스를 변환
  - 직렬화, 역직렬화, 인스턴스로의 변환을 담당
  - 중첩된 객체에도 쉽게 적용 가능
  - custom transformer로 어떤 변환이든 가능
  - class vlaidator를 제작한 개발자가 시작한 프로젝트

- class validator와 class transformer의 차이

  - class validator: 변환하지 않고 검증만 진행
  - class transformer: 변환을 진행

## Joi

- 특성

  - 스키마 기반 검증 라이브러리
  - 타입세이프 하게 객체를 검증해서 데이터 무결성 유지
  - 풍부한 에러메시지 커스터마이제이션 가능
  - Extension을 통해 얼마든지 새로운 검증 로직 추가가 가능하다
  - \*NestJS에서는 환경변수 검증할 때 많이 사용한다

- 커스텀 에러메시지
  - messages 메서드를 사용해 에러메시지 변경이 가능하다
  - key에 에러코드를 입력하고, value에 에러 메시지를 입력한다

# Ch.5 디버거 사용법 [250329]

## 디버거가 필요한 이유

- 일반적으로는 console.log를 통해서 확인하는 과정을 거치게 됨, 그러나 너무 번거롭다

## 디버거 세팅 방법(VSC 기준)

- IDE 재생버튼 - create a launch.json file 버튼 클릭 - node.js 클릭: launch.json 파일 생성
- lauch.json 파일에 입력
  ```json
  {
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        "name": "Debug Nest Framework",
        "runtimeExecutable": "pnpm", // 실행 방식
        "runtimeArgs": [
          "run",
          "start:debug", // debug를 실행
          "--",
          "--inspect-brk"
        ],
        "autoAttachChildProcesses": true,
        "restart": true,
        "sourceMaps": true,
        "stopOnEntry": false,
        "console": "integratedTerminal"
      }
    ]
  }
  ```
- 디버거 실행하고 중단점 설정
- postman으로 관련된 동작 호출 시에 breakpoint의 변수 확인 가능

# Ch.4 [250329]

## @Module 기능

- imports: 외부의 다른 모듈을 불러들일 때
- exports: 외부로 모듈을 내보낼 때
- controllers
- providers

## CLI을 이용한 생성

- `nest g controller`: 특정 모듈에 관한 컨트롤러를 만들 수 있는 명령어
- `nest g provider`: 특정 모듈에 관한 프로바이더를 만들 수 있는 명령어
- \*`nest g resource`: 특정 모듈로 관리되는 자료를 간단하게 만들 수 있는 명령어

# Ch.3 프로바이더 & 서비스 [250329]

## Controller와 Service를 구분하는 이유

- 한 곳(ex. Controller)에 코드를 몰아두면 요청에 대한 에러가 있을 때, 프로세스 상에서 문제인지, 서비스 로직 상에서 문제인지 확인하기 어려움

## Dependency Injetion & Inversion of Control (DI & IoC)

- Dependency Injetion(DI)

  - class B를 class A에서 사용하려고 할 때 constructor(instance: B) 주입

- Inversion of Conrol(IoC, 제어의 역전)

  - DI를 위해서는 매번 클래스를 인스턴스화 해서 직접 넣어줘야 하는 번거로움 발생
  - Nest.js 자체에서 IoC 컨테이너: 클래스를 인스턴스화해서 알아서 주입해준다

- DI & IoC
  - Nest.js에는 IoC가 존재
  - IoC 안에는 선언해 놓은 클래스(모듈에 넣을)를 프로바이더에 집어 넣어두면 자동으로 클래스 인스턴스(B, C)를 만든다
  - 클래스 A에서 B를 사용하는 경우 인스턴스를 만들어 생성 & 주입을 자동으로 해준다

# Ch.2 Controller [250329]

- @Controller
- @Get, @Post
- pnpm start:dev : 변경사항을 감시해서 서버 재실행

- movie GET, POST, PATCH, DELETE 컨트롤러 생성

## NestJS 요청 라이프 사이클

0. 클라이언트의 Request 요청
1. middleware
2. guard
3. interceptor
4. pipe
5. 요청로직 처리부분(모듈): controller, service, repository
6. exception filter
7. interceptor
8. response 응답

## 파일 구조

- dist: 실제로 배포했을 때와 관련된 파일
- node_modules: 패키지 그룹
- src: 실제로 코드를 작성하는 부분
- test: 테스트를 위한 폴더

  cf. src/~.spec.ts : 단위 테스트, test/ : e2e 테스트

- package.json
