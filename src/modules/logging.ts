import { Module } from '@nestjs/common';
import LoggingService from '../services/logging';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [ElasticsearchModule.register({
    node: 'http://34.64.247.101:9500',
    auth: {
      username: 'elastic',
      password: 'threebus'
    }
  })],
  providers: [LoggingService],
})
export class LoggingModule {}