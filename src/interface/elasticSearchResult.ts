import { PostSearchBody } from "./elasticSearchBody";

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

export interface ElasticUpdateResult {
  _index: string,
  _type: string,
  _id: string,
  _version: string,
  result: string,
  _shards: {
    total: number,
    successful: number,
    failed: number
  },
  _seq_no: number,
  _primary_term: number
}