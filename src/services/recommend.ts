import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticAggregationsResult, ElasticSearchResult } from '../interface/elasticSearchResult';

@Injectable()
export default class RecommendService {
  loggingIndex = 'logging-*';
  productIndex = 'products-2022-2';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {
  }

  async getRecommendProduct(userId: number) {
    const recommendQuery = {
      index: this.loggingIndex,
      body: {
        'size': 0,
        'query': {
          'bool': {
            'must': [
              {
                'match': {
                  'userId': userId,
                },
              },
            ],
          },
        },
        'aggs': {
          'user': {
            'terms': {
              'field': 'userId',
            },
            'aggs': {
              'productclick': {
                'terms': {
                  'field': 'productId',
                  'size': 10,
                },
              },
            },
          },
        },
      },
    };

    const result = await this.elasticsearchService.search<ElasticAggregationsResult>(recommendQuery);
    const recommendArr = result.body.aggregations.user.buckets[0].productclick.buckets;
    for (const resultObj of recommendArr) {
      const matchQuery = {
        index: this.productIndex,
        body: {
          'query': {
            'match': {
              'id': resultObj.key,
            },
          },
        },
      };
      const { body } = await this.elasticsearchService.search<ElasticSearchResult>(matchQuery);
      const hits = body.hits.hits;
      const totalValue = body.hits.total['value'];
      if (totalValue > 0) {
        let resultObj = {};
        const { category, firstattr, secondattr } = body.hits.hits[0]._source;
        const recommendQuery = {
          index: this.productIndex,
          body: {
            'query': {
              'bool': {
                'must': [
                  {
                    'match': {
                      'category': category,
                    },
                  },
                  {
                    'match': {
                      'firstattr': firstattr || '',
                    },
                  },
                ],
                'should': [
                  {
                    'match': {
                      'secondattr': secondattr || '',
                    },
                  },
                ],
              },
            },
            'sort': [
              {
                'viewcnt': {
                  'order': 'desc',
                },
              },
            ],
          },
        };
        const bodyObj = await this.elasticsearchService.search<ElasticSearchResult>(recommendQuery);
        console.log(JSON.stringify(bodyObj));
      }
    }
  }
}