import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../entitys/tests';
import { AddTestsDto } from '../dto/tests';

@Injectable()
export class TestsDao {
  constructor(
    @InjectRepository(TestEntity)
    private userRepository: Repository<TestEntity>,
  ) {}

  public getAllTests(): Promise<TestEntity[]> {
    return this.userRepository.find();
  }

  public addTest(addUser: AddTestsDto): Promise<TestEntity> {
    return this.userRepository.save(addUser);
  }
}
