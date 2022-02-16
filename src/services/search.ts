import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ElasticSearchResult } from "../interface/elasticSearchResult";
import { integer } from "@elastic/elasticsearch/api/types";
import { mustTermsQuery, sortQuery } from "../utils/elasticUtils";

@Injectable()
export default class PostsSearchService {
  index = "products-*";

  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {
  }

  async search(text: string, pageSize: integer, currentPage: integer, brand?: string, eventtype?: string, category?: string,sort?:string) {
    let inputObj = {
      index: this.index,
      body: {
        "size": 10 * (pageSize || 1),
        "from": ((currentPage || 1) - 1) * 10,
        "query": {
          "bool": {
            "must": []
          }
        },
        "sort": []
      }
    };
    const mustQuery = mustTermsQuery(text,brand,eventtype,category);
    const sortingQuery = sortQuery(sort);

    inputObj.body.query.bool.must.push(...mustQuery);
    inputObj.body.sort.push(...sortingQuery);

    const { body } = await this.elasticsearchService.search<ElasticSearchResult>(inputObj);
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