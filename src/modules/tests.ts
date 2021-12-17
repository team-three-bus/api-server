import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestsController } from '../controllers/tests';
import { TestsService } from '../services/tests';
import { TestEntity } from '../entitys/tests';
import { TestsDao } from '../dao/tests';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])],
  controllers: [TestsController],
  providers: [TestsService, TestsDao],
})
export class TestsModule {}
