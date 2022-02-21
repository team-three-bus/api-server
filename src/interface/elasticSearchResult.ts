import { PostSearchBody } from "./elasticSearchBody";

export interface ElasticSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export interface ElasticPutDocumentResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}