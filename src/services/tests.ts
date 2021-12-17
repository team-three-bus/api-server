import { Injectable } from '@nestjs/common';
import { TestEntity } from '../entitys/tests';
import { TestsDao } from '../dao/tests';
import { AddTestsDto } from '../dto/tests';

@Injectable()
export class TestsService {
  public constructor(private testsDao: TestsDao) {}

  public async findAllTest(): Promise<TestEntity[]> {
    return await this.testsDao.getAllTests();
  }

  public async addTest(addTest: AddTestsDto): Promise<TestEntity> {
    return await this.testsDao.addTest(addTest);
  }
}
