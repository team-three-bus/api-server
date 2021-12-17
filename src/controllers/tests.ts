import { Controller, Get, Post, Body } from '@nestjs/common';
import { TestsService } from '../services/tests';
import { AddTestsDto } from '../dto/tests';

@Controller('tests')
export class TestsController {
  public constructor(private readonly testsService: TestsService) {}

  @Get('/')
  public async allTestData(): Promise<any> {
    const testAllData = await this.testsService.findAllTest();

    return testAllData;
  }

  @Post('/')
  public async addTest(@Body() addTest: AddTestsDto): Promise<any> {
    const createdTest = await this.testsService.addTest(addTest);

    return createdTest;
  }
}
