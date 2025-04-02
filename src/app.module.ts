import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Movie } from './movie/entity/movie.entity';
import { MovieDetail } from './movie/entity/movie-detail.entity';
import { MovieModule } from './movie/movie.module';

// IoC 컨테이너에 관리될 클래스들을 모아두는 곳
@Module({
  imports: [
    // 설정에 관한 유효성 검사 진행, 전역에서 사용할 수 있도록 함
    // 1. 환경변수 로드
    // 2. configService.get('key') 접근 가능
    // 3. 전역 설정 관리
    ConfigModule.forRoot({
      isGlobal: true, // 어떤 모듈에서든 설정 파일을 사용할 수 있도록 함
      validationSchema: Joi.object({
        // Joi: 환경변수의 유효성을 검증
        ENV: Joi.string().valid('dev', 'prod').required(),
        DB_TYPE: Joi.string().valid('postgres').required(), // postgres만 허용
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    // DB와 연결 담당
    TypeOrmModule.forRootAsync({
      // 비동기 이유: forRoot의 설정값들이 IoC 컨테이너에 생성된 이후에, 인젝션을 받아 사용하기 위해서
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Movie, MovieDetail], // 엔티티 등록
        synchronize: true, // 개발할 때만 true 적용, 자동으로 코드와 DB를 동기화 적용
      }),
      inject: [ConfigService],
    }),
    MovieModule,
  ], // CLI로 생성한 모듈이 자동으로 추가됨
})
export class AppModule {}
