import {  PostSearchBody } from './elasticSearchBody';

export interface ElasticSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export interface ElasticAggregationsResult {
  aggregations: {
    user: {
      buckets: Array<{
        productclick: {
          buckets: Array<{
            key: number;
            doc_count: number;
          }>
        }
      }>
    }
  };
}