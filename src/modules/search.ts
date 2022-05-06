import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import PostsSearchService from '../services/search';
import PostsController from '../controllers/search';

@Module({
  imports: [ElasticsearchModule.register({
    node: 'http://34.64.152.242:9500',
    auth: {
      username: 'elastic',
      password: 'threebus'
    }
  })],
  controllers: [PostsController],
  providers: [PostsSearchService]
})
export class ElasticModule {}