import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import RecommendController from '../controllers/recommend';
import RecommendService from '../services/recommend';

@Module({
  imports: [ElasticsearchModule.register({
    node: 'http://34.64.247.101:9200'
  })],
  controllers: [RecommendController],
  providers: [RecommendService]
})
export class RecommendModule {}