import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ElasticSearchResult } from "../interface/elasticSearchResult";
import { integer } from "@elastic/elasticsearch/api/types";
import { mustTermsQuery, sortQuery } from "../utils/elasticUtils";
import { nowMonth, nowYear } from "../utils/util";

@Injectable()
export default class PostsSearchService {
  index = `products-${nowYear}-${nowMonth}`;

  constructor(private readonly elasticsearchService: ElasticsearchService) {
  }

  async search(text: string, pageSize: integer, currentPage: integer, brand?: string, eventtype?: string, category?: string, sort?: string) {
    let inputQuery = {
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
    const mustQuery = mustTermsQuery(text, brand, eventtype, category);
    const sortingQuery = sortQuery(sort);

    inputQuery.body.query.bool.must.push(...mustQuery);
    sortingQuery.length > 0 ? inputQuery.body.sort.push(...sortingQuery) : "";

    return await this.elasticSearchResult(inputQuery, pageSize, currentPage);
  }

  async categorySearch(search: string, pageSize: integer, currentPage: integer, brand?: string, eventtype?: string, category?: string, sort?: string) {
    // 반찬, 반려동물 으로 속성값을 검색했을때는 해당값으로 변경
    if (search === "반찬") {
      search = "김치/조림";
    } else if (search === "반려동물") {
      search = "애견용";
    }

    let inputQuery = {
      index: this.index,
      body: {
        "size": 10 * (pageSize || 1),
        "from": ((currentPage || 1) - 1) * 10,
        "query": {
          "bool": {
            "should": [
              {
                "simple_query_string": {
                  "query": search + "*",
                  "fields": [
                    "firstattr",
                    "secondattr"
                  ]
                }
              }
            ],
            "must": []
          }
        },
        "sort": []
      }
    };

    const mustQuery = mustTermsQuery(null, brand, eventtype, category);
    const sortingQuery = sortQuery(sort);

    inputQuery.body.query.bool.must.push(...mustQuery);
    sortingQuery.length > 0 ? inputQuery.body.sort.push(...sortingQuery) : "";

    return await this.elasticSearchResult(inputQuery, pageSize, currentPage);
  }

  async elasticSearchResult(inputQuery, pageSize, currentPage) {
    const { body } = await this.elasticsearchService.search<ElasticSearchResult>(inputQuery);
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