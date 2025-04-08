# Ch.8 SQL

## SQL

### SQL 이론

- SQL이란

  - Structured Query Langage의 약자
  - RDBMS를 다루는 통합 언어
  - INSERT, SELECT, UPDATE, DELETE를 통해 CRUD 작업이 가능하다
  - DB 스키마를 변경할 수 있는 DDL을 포함한다
  - BEGIN, COMMIT, ROLLBACK 키워드를 통한 ACID Trasnaction을 지원한다

- 기본 쿼리

  - SELECT: 데이터 조회
  - WHERE: 데이터 필터링
  - ORDER BY: 정렬 기준
  - GROUP BY: 통계를 그룹으로 나눌 때 사용
  - HAVING: 계산에 조건을 추가
  - JOIN ON: 테이블은 연결
  - INSERT INTO: 데이터 생성
  - UPDATE SET: 데이터 업데이트
  - DELETE: 데이터 삭제
  - 서브쿼리

### Mac에 PostgreSQL 세팅

- 강의 기준 설치 내용

  - 16 버전 사용
  - password: postgres
  - port: 5555 (일반적으로는 5432를 사용, 개인진행 시 5555가 안되서 5432로 설정 진행)
  - locale: 기본값
  - 실습 DB 설정: NestJS Netflix / 5432 / postgres

- 사용법

  - add new server
  - 이름: NestJS Netflix

## TypeORM

- ORM

  - Object Relation Model
  - SQL문이 아닌 언어로 쿼리를 작성할 수 있도록 함

- 특성

  - OOP를 사용해서 DB 테이블을 클래스로 관리할 수 있게 해준다
  - 다양한 DB를 지원한다
  - Active Record, Data Mapper 패턴을 모두 지원한다
  - 자체적으로 Migration 기능을 지원, 점진적인 DB 구조 변경과 버저닝을 모두 지원
  - Eager & Lazy 로딩을 모두 지원해 데이터 호출에 완전한 컨트롤이 가능

- DataSource

  - 사용할 데이터베이스를 지정하고 정보를 제공하는 역할

  ```typescript
  const PostgresDataSource = new DataSource({
    type: 'postgres', // 데이터베이스 종류
    host: 'localhost', // 연결 호스트
    port: 5432, // 연결 포트
    username: 'test', //아이디
    password: 'test', // 비밀번호
    database: 'test', // 연결 DB
    entities: [], // TS 엔티티 객체
  });
  ```

- Entity

- 주요 Column 옵션

  - type / name / nullable / update / select
  - default / unique / comment / enum / array

- 특수 Column

  - @CreateDateColumn: 자동으로 row 생성 시 날짜 시간 저장
  - @UpdateDateColumn: 자동으로 row 최근 업데이트 날짜시간을 저장
  - @DeleteDateColumn: 자동으로 row의 soft delete 날짜 시간을 저장
  - @VersionColumn: 자동으로 row가 업데이트 될 때마다 1씩 증가

### DataSource 정의하고 환경변수 사용

### Repoistory

- 설치

  - `pnpm i @nestjs/config joi @nestjs/typeorm typeorm pg`
  - app.module.ts에 추가

- Repository

  - Entity에 대한 CRUD를 가능하게 해준다
  - TypeORM에 정의된 메서드들을 사용해서 직접 SQL을 작성하지 않더라도 데이터 관리를 할 수 있다

- 기본 옵션

  - create()

    - 객체를 생성
    - save()와의 차이점: 데이터를 생성하는게 아니라 \*객체를 생성

  - save()

    - create()와 다르게 실제 DB에 저장이된다
    - 이미 row가 존재한다면 업데이트한다(주의)
    - 여러 객체를 한 번에 저장하는 것도 가능

  - upsert()

    - update 기능 + insert 기능
    - 데이터 생성을 시도하고, 이미 존재하는 데이터라면 업데이트를 진행한다
    - save와 다르게 하나의 transaction에서 작업이 실행 (ps. save는 id 조회 transaction + update 트랜잭션: 최대 2번의 트랜잭션을 발생시킨다)

  - delete()

    - row 삭제
    - 주로 PK를 이용해서 삭제 진행
    - findOptionsWhere 조건으로 여러 값을 삭제할 수 있다

  - softDelete(), restore()

    - softDelete: 비영구적으로 삭제
    - restore()를 실행하면 softDelete 했던 row를 복구 할 수 있다

  - update()

    - 첫 번째 파라미터에 조건을 입력, 두 번째 파라미터에 변경 필드를 입력

  - find(), findOne(), findAndCount()

    - find(): 해당하는 모든 row 반환
    - findOne(): 해당하는 첫번째 row 반환
    - findAndCount(): 해당되는 row와 전체 갯수 반환

  - exists()

    - 특정 row가 존재하는지 boolean 값 반환

  - preload()

    - DB에 저장된 값을 PK를 기준으로 불러오고, 입력된 객체 값으로 덮어쓴다
    - 덮어쓰는 과정에서 업데이트 요청이 전달되진 않는다 (변경사항을 반영하고 싶다면 save()를 해줘야 한다)

  - findOptions()

    - Select
    - Where
    - Relations: 불러올 관계 테이블 지정
    - Order: 정렬 기준
    - Cache: 캐싱 기간 지정

  - findManyOptions

    - Skip: 정렬 후 스킵할 데이터 개수를 설정
    - Take: 몇 개의 데이터를 불러올지 설정

- 심화 옵션

  - Equal
  - Not
  - LessThan, LessThandOrEqual
  - MoreThan, MoreThanOrEqual
  - Between
  - Like, ILike: 스트링에 매칭되는 값을 찾는다, ILike는 대소문자를 구분하지 않는다
  - In
  - (비추) ArrayContains, ArrayContainedBy, ArrayOverlap

    - ArrayContains: 리스트 값이 타겟 리스트와 같은 똑같은 경우 필터링
    - ArrayContainedBy: 리스트 값이 타겟 리스트 안에 모두 포함되는 경우 필터링
    - ArrayOverlap: 리스트 값이 타겟 리스트와 겹치는 경우 필터링

- Q. find(), findAndCount()

  - Q. 작업에 async/await를 사용하는 이유
    A. DB 작업은 비동기로 진행

  - Q. findAndCount() vs count()
    A. findAndcount: [entities, count] 형태 반환, count: number만 반환

### Entity Embedding

- 엔티티를 가지고 다른 엔티티의 컬럼으로 사용하는 방식

```typescript
export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

@Entity()
export class user {
  @PriamryGeneratedColumn()
  id: string;

  @Column(() => Name) // entity embedding
  name: Name;

  @Column
  isactive: boolean;
}
```

### Entity Inheritance

- 엔티티 상속 방식

```typescript
export abstract class Content {
  @PriamryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column
  description: string;
}

@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}
```

### Single Table Inheritance (비추, 그러나 방식이 있다는 것 알아두기)

```typescript
@Entity()
@TableInheritance({
  columN: {
    type: 'varchar',
    name: 'type',
  },
})
export class Content {
  @PriamryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column
  description: string;
}

@ChildEntity()
export class Photo extends Content {
  @Column()
  size: string;
}
```

### Relationship

- 4가지 관계

  - @OneToOne
  - @ManyToOne
  - @OneToMany
  - @ManyToMany

- ManyToOne

  - FK 레퍼런스를 들고 있는 입장이 Many에 해당

  ```typescript
  @Entity()
  export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(
      () => User, // 어떤 테이블과 조인할 것인지
      (user) => user.photos, // 맵핑하는 컬럼
    )
    user: User;
  }

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
      () => Photo, // 어떤 테이블과 조인할 것인지
      (photo) => photo.user, // 매핑하는 컬럼
    )
    photos: Photo[];
  }
  ```

- OneToOne

  - OneToOne은 레퍼런스를 누가 들고 있든 상관 없다, 따라서 명시해줄 필요가 있다
  - @JoinTable: 어떤 프로퍼티가 레퍼런스를 들고 있을지 정해줄 수 있다
  - @JoinTable은 반드시 한 쪽에만 적용

- ManyToMany

  - @JoinTable을 한쪽에 적용해야 한다
  - 중개 테이블이 생성될 때 @JoinTable이 적용된 테이블 이름이 먼저 위치한다

## Query Builder

### Query Builder

- 일반적인 쿼리를 실행할 때는 repository를 사용하자
- 동적으로 복잡한 쿼리를 만들어야 할 때는 query builder를 사용하자

- 5가지 타입

  1. SELECT

  ```typescript
  const movie = await dataSource
    .createQueryBuilder()
    .select('movie')
    .from(Movie, 'movie')
    .leftJoinAndSelect('movie.detail', 'detail')
    .leftJoinAndSelect('movie.director', 'director')
    .leftJoinAndSelect('movie.genres', 'genres');
    .where("movie.id = :id", { id: 1})
    .getOne();
  ```

  2. INSERT

  ```typescript
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Movie)
    .values([
      {
        title: 'New Movie',
        genre: 'Action',
        director: director,
        genres: genres,
      },
    ])
    .execute();
  ```

  3. UPDATE

  ```typescript
  await dataSource
    .createQueryBuilder()
    .update(Movie)
    .set({ title: 'Updated Title', genre: 'Drama' })
    .where('id = :id', { id: 1 })
    .execute();
  ```

  4. DELTE

  ```typescript
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(Movie)
    .where('id = :id', { id: 1 })
    .execute();
  ```

  5. RELATIONS

  ```typescript
  const genres = await dataSource
    .createQueryBuilder()
    .relation(Movie, 'genres')
    .of(1) // Movie id
    .loadMany();
  ```

- save의 경우 querybuilder를 사용하게 되면 더 번거로울 수 있다(커밋에 기록된 코드 참고 하기)

- 트랜잭션: 여러 개의 쿼리를 하나의 쿼리로 묶어서 실행, 단 한 개라도 실패하게 되면 롤백을 진행

## Transaction

- 여러 오퍼레이션을 하나의 논리적인 작업으로 실행하는 기능

- 트랜잭션의 세 가지 요소

  1. Begin
  2. Commit
  3. Rollback

- 트랜잭션의 문제점

  1. Lost Reads: 두 트랜잭션이 같은 데이터를 업데이트해서 하나의 업데이트가 손실되는 경우

     - 두 개의 트랜잭션이 같은 데이터를 읽고 업데이트 한다
     - 나중에 진행된 트랜잭션이 먼저 진행된 트랜잭션의 결과를 덮어쓴다
     - 먼저 진행된 트랜잭션의 작업은 유실된다
     - Optimistic Lock 전략으로 해결 가능: 버전을 기록해서 버전이 올라간 경우 업데이트 하지 않음

     ```sql -- 초기상태
     -- Table: account
     -- | id | balance |
     -- |----|---------|
     -- | 1  | 1000    |

     -- Transaction 1
     BEGIN TRANSACTION;
     SELECT balance FROM account WHERE id = 1; -- 1000 반환
     UPDATE account SET balance = balance - 100 WHERE id = 1; -- 900으로 변경

     -- Transaction 2 (happens concurrently)
     BEGIN TRANSACTION;
     SELECT balance FROM account WHERE id = 1; -- Returns 1000
     UPDATE account SET balance = balance - 200 WHERE id = 1; -- 800으로 변경

     -- Transaction 1 진행
     COMMIT; -- Balance = 900

     -- Transaction 2 진행
     COMMIT; -- Balance = 800

     -- Final State
     -- | id | balance |
     -- |----|---------|
     -- | 1  | 800     |
     ```

  2. Dirty Reads: 아직 커밋되지 않은 값을 다른 트랜잭션이 읽는 경우

     - 아직 커밋되지 않은 다른 트랜잭션의 데이터를 읽었을 때 생기는 문제
     - 변경한 데이터를 커밋하지 않고 롤백한 경우, 롤백 전에 읽은 데이터를 읽은 다른 트랜잭션은 잘못된 정보로 로직을 진행
     - Read Comitted 트랜잭션으로 해결 가능: 키워드를 변경

       ```sql
       -- 초기상태
       -- Table: account
       -- | id | balance |
       -- |----|---------|
       -- | 1  | 1000    |


       -- Transaction 1
       BEGIN TRANSACTION;
       UPDATE account SET balance = balance - 100 WHERE id = 1; -- balance = 900

       -- Transaction 2
       BEGIN TRANSACTION;
       SELECT balance FROM account WHERE id = 1; -- 900 반환

       -- Transaction 1 롤백
       ROLLBACK; -- Balance 1000으로 되돌림

       -- Transaction 2 진행
       -- Transaction 2 에서 읽은 balance 값은 잘못된 값임.
       ```

  3. Non-repeatable Reads: 한 트랜잭션에서 데이터를 두 번 읽을 때 다른 결과가 나오는 경우

     - 트랜잭션이 데이터를 읽은 상태에서 다른 트랜잭션이 데이터를 변경할 경우, 같은 데이터를 다시 읽었을 때 기존에 읽었떤 데이터가 재구현되지 않는 현상

     - Repeatable Read 트랜잭션으로 해결 가능하다:

     ```sql
     -- 초기상태
     -- Table: account
     -- | id | balance |
     -- |----|---------|
     -- | 1  | 1000    |

     -- Transaction 1
     BEGIN TRANSACTION;
     SELECT balance FROM account WHERE id = 1; -- 1000 반환

     -- Transaction 2
     BEGIN TRANSACTION;
     UPDATE account SET balance = balance - 100 WHERE id = 1; -- balance = 900
     COMMIT;

     -- Transaction 1 continues
     SELECT balance FROM account WHERE id = 1; -- 900 반환 (non-repeatable read)
     COMMIT;
     ```

  4. Phantom Reads: 첫 Read 이후에 다른 트랜잭션에서 데이터를 추가한 경우

     - 트랜잭션이 여러 row를 불러오는 필터링 쿼리를 진행 후, 다른 트랜잭션에서 쿼리의 조건에 맞는 새로운 데이터를 생성했을 때, 같은 쿼리가 다른 겨로가를 반환하는 것을 이야기 함

     - serializable 트랜잭션으로 해결 가능

     ```sql
     -- 초기상태
     -- Table: account
     -- | id | balance |
     -- |----|---------|
     -- | 1  | 1000    |
     -- | 2  | 1500    |

     -- Transaction 1
     BEGIN TRANSACTION;
     SELECT * FROM account WHERE balance > 1000; -- account 2 반환

     -- Transaction 2
     BEGIN TRANSACTION;
     INSERT INTO account (id, balance) VALUES (3, 1200);
     COMMIT;

     -- Transaction 1
     SELECT * FROM account WHERE balance > 1000; -- account 2 and account 3 반환 (phantom read)
     COMMIT;
     ```

- Transaction Level & Transaction Anomaly 자료 확인할 것

  - part8. 데이터베이스 - ch 4. transaction - 01. transaction 이론 - 10:29

- 사용법

  - BEGIN과 COMMIT 사이에 명령어를 입력

    ```sql
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    BEGIN TRANSACTION;
    -- SQL 작업하기
    COMMIT;
    ```

## Migration

- 데이터 변경사항을 스크립트로 작성해서 반영한다. 통제된 상황에서 데이터베이스 스키마 변경 및 복구를 진행할 수 있다

- Migration이 필요한 이유: 왜 sync 옵션으로는 부족할까?

  - Controlled Changes: 원하는 상황에 원하는 형태로 마이그레이션을 자유롭게 실행할 수 있다
  - Reversible: 진행한 마이그레이션을 쉽게 되돌릴 수 있다
  - Versioning: 마이크레이션은 스키마 변경에 대한 히스토리를 담고 있어 디버깅에 매우 유용하다
  - Consistency: 다양한 환경에서 데이터베이스 스키마가 같게 유지되도록 할 수 있다
  - Complex Changes: 복잡한 데이터베이스의 변화를 직접 컨트롤할 수 있다

- Migration Configuration: ormconfig.json

  ```json
    {
      'type': ...
      ...
      "migrations": ["src/migtaion/**/*.ts"]  // 이 부분!
      'cli': {
        ...
      }
    }
  ```

- 주요 개념

  - up: 마이그레이션을 진행할 때
  - down: 마이그레이션을 롤백할 때

- Migration CLI 커맨드

  - 참고 : https: //typeorm.io/migrations

  ```shell
  # Migration 파일 생성
  npx typeorm migration:generate  <MigrationName>

  # Migration 실행하기
  npx typeorm migration:run

  # Migration 되돌리기
  npx typeorm migration:revert
  ```

- 개발할 때는 sync true를 옵션을 가지고 자동으로 마이그레이션이 실행되도록 하는데, 프로덕션에서는 DB 정보가 소중하다(함부로 생성/삭제 하면 안됨) 따라서 항상 마이그레이션 파일을 만들고, 마이그레이션을 프로덕션 데이터베이스에서 진행하는 방식을 사용하곤 한다

  - sync:true: 빠른 개발을 위해 DB 테이블이 쉽게 변경
  - migration: 쿼리문이 남아있기 때문에 다시 실행이 가능
