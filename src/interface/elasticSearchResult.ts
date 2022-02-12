import { PostSearchBody } from "./elasticSearchBody";

export interface ElasticSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}