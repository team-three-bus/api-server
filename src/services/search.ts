import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ElasticSearchResult } from "../interface/elasticSearchResult";
import { integer } from "@elastic/elasticsearch/api/types";

@Injectable()
export default class PostsSearchService {
  index = "products-*";

  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) { }

  async search(text: string, pageSize: integer, currentPage: integer) {
    const { body } = await this.elasticsearchService.search<ElasticSearchResult>({
      index: this.index,
      body: {
        "size": 10 * (pageSize || 1),
        "from": ((currentPage || 1) - 1) * 10,
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
    });
    const hits = body.hits.hits;
    const totalValue = body.hits.total["value"];
    if (totalValue > 0) {
      let resultObj = {};
      resultObj["pageSize"] = pageSize;
      resultObj["productCnt"] = totalValue;
      resultObj["currentPage"] = currentPage;
      resultObj["list"] = hits.map((item) => item._source);
      return resultObj;
    } else {
      return "";
    }

  }
}