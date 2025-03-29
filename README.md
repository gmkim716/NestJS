# 코드팩토리 강의노트

## Ch.6 유효성 검사 및 변환

### DTO(Data Transfer Obeject)

- body.x, body.y와 같이 사용 가능한 장점

### Class Validator

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

## Ch.5 디버거 사용법 [250329]

### 디버거가 필요한 이유

- 일반적으로는 console.log를 통해서 확인하는 과정을 거치게 됨, 그러나 너무 번거롭다

### 디버거 세팅 방법(VSC 기준)

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

## Ch.4 [250329]

### @Module 기능

- imports: 외부의 다른 모듈을 불러들일 때
- exports: 외부로 모듈을 내보낼 때
- controllers
- providers

### CLI을 이용한 생성

- `nest g controller`: 특정 모듈에 관한 컨트롤러를 만들 수 있는 명령어
- `nest g provider`: 특정 모듈에 관한 프로바이더를 만들 수 있는 명령어
- \*`nest g resource`: 특정 모듈로 관리되는 자료를 간단하게 만들 수 있는 명령어

## Ch.3 프로바이더 & 서비스 [250329]

### Controller와 Service를 구분하는 이유

- 한 곳(ex. Controller)에 코드를 몰아두면 요청에 대한 에러가 있을 때, 프로세스 상에서 문제인지, 서비스 로직 상에서 문제인지 확인하기 어려움

### Dependency Injetion & Inversion of Control (DI & IoC)

- Dependency Injetion(DI)

  - class B를 class A에서 사용하려고 할 때 constructor(instance: B) 주입

- Inversion of Conrol(IoC, 제어의 역전)

  - DI를 위해서는 매번 클래스를 인스턴스화 해서 직접 넣어줘야 하는 번거로움 발생
  - Nest.js 자체에서 IoC 컨테이너: 클래스를 인스턴스화해서 알아서 주입해준다

- DI & IoC
  - Nest.js에는 IoC가 존재
  - IoC 안에는 선언해 놓은 클래스(모듈에 넣을)를 프로바이더에 집어 넣어두면 자동으로 클래스 인스턴스(B, C)를 만든다
  - 클래스 A에서 B를 사용하는 경우 인스턴스를 만들어 생성 & 주입을 자동으로 해준다

## Ch.2 Controller [250329]

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
