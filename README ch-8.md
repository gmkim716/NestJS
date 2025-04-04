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
