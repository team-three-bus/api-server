import { Module } from '@nestjs/common';
import LoggingController from '../controllers/logging';
import LoggingService from '../services/logging';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [ElasticsearchModule.register({
    // node: process.env.ELASTICSEARCH_NODE
    node: 'http://34.64.247.101:9200'
  })],
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class LoggingModule {}