import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestsModule } from './modules/tests';
import { ProductsModule } from './modules/products';
import { ProductAttrModule } from './modules/productAttr';
import { EventsModule } from './modules/events';
import { UsersModule } from './modules/users';
import { LikeModule } from './modules/like';
import { ElasticModule } from './modules/search';
import { RecommendModule } from './modules/recommend';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entitys/*{.ts,.js}'],
      synchronize: false,
    }),
    TestsModule,
    ProductsModule,
    ProductAttrModule,
    EventsModule,
    UsersModule,
    LikeModule,
    ElasticModule,
    RecommendModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
