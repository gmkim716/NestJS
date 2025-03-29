# 코드팩토리 강의노트

## Ch.3 프로바이더 & 서비스

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
