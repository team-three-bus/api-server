import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticSearchResult } from '../interface/elasticSearchResult';

@Injectable()
export default class PostsSearchService {
  index = 'products-*'

  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  async search(text: string) {
    const { body } = await this.elasticsearchService.search<ElasticSearchResult>({
      index: this.index,
      body: {
        "size": 100000,
        "query": {
          "bool": {
            "must": [
              {
                "simple_query_string": {
                  "query": text,
                  "fields": ["name.nori"]
                }
              }
            ]
          }
        }
      }
    })
    const hits = body.hits.hits;
    const totalValue = body.hits.total;
    if(totalValue['value'] > 0) {
      return hits.map((item) => item._source);
    } else {
      return '';
    }

  }
}