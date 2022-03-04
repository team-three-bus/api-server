import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ElasticAggregationsResult, ElasticSearchResult, ElasticUpdateResult } from "../interface/elasticSearchResult";
import { nowMonth, nowYear, sortObj } from "../utils/util";

@Injectable()
export default class RecommendService {
  loggingIndex = "logging-*";
  productIndex = `products-${nowYear}-${nowMonth}`;

  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {
  }

  async getRecommendProduct(userId: number, size: number) {
    let tempObj = {};
    const recommendQuery = {
      index: this.loggingIndex,
      body: {
        "size": 0,
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "userId": userId
                }
              }
            ]
          }
        },
        "aggs": {
          "user": {
            "terms": {
              "field": "userId"
            },
            "aggs": {
              "productclick": {
                "terms": {
                  "field": "productId",
                  "size": 10
                }
              }
            }
          }
        }
      }
    };

    const result = await this.elasticsearchService.search<ElasticAggregationsResult>(recommendQuery);
    if(result.body.aggregations.user.buckets.length > 0) {
      const recommendArr = result.body.aggregations.user.buckets[0].productclick.buckets;
      for (const resultObj of recommendArr) {
        const matchQuery = {
          index: this.productIndex,
          body: {
            "query": {
              "match": {
                "id": resultObj.key
              }
            }
          }
        };
        const { body } = await this.elasticsearchService.search<ElasticSearchResult>(matchQuery);
        const hits = body.hits.hits;
        const totalValue = body.hits.total["value"];
        if (totalValue > 0) {
          const input = hits[0]._source.category + "+" + hits[0]._source.firstattr;
          if (tempObj[input]) {
            tempObj[input] = tempObj[input] + resultObj.doc_count;
          } else {
            tempObj[input] = resultObj.doc_count;
          }
        }
      }

      const sortingValueObj = sortObj(tempObj);
      const outputArr = Object.keys(sortingValueObj)[0].split("+");
      const matchProductQuery = {
        index: this.productIndex,
        body: {
          "size": size,
          "query": {
            "bool": {
              "must": [
                {
                  "match": {
                    "category": outputArr[0]
                  }
                },
                {
                  "match": {
                    "firstattr": outputArr[1]
                  }
                }
              ]
            }
          },
          "sort": [
            {
              "viewcnt": {
                "order": "desc"
              }
            }
          ]
        }
      };

      try {
        const { body } = await this.elasticsearchService.search<ElasticSearchResult>(matchProductQuery);
        const hits = body.hits.hits;
        const totalValue = body.hits.total["value"];
        if (totalValue > 0) {
          let resultObj = {};
          resultObj["list"] = hits.map((item) => item._source);
          return resultObj;
        } else {
          return "";
        }
      } catch (e) {
        console.log(JSON.stringify(outputArr));
        console.log(JSON.stringify(matchProductQuery));
      }
    } else {
      return "";
    }
  }

  async defaultRecommendProduct() {
    let recommendArr = [];
    const randomSeed = Math.floor(Math.random() * 20000000 + 1);
    const brandArr = ["GS", "CU", "emart24", "7-ELEVEN"];
    let resultObj = {};
    for (const brand of brandArr) {
      const randomSearchQuery = {
        index: this.productIndex,
        body: {
          "size": 3,
          "query": {
            "function_score": {
              "query": {
                "match": {
                  "brand": brand
                }
              },
              "functions": [
                {
                  "random_score": {
                    "seed": randomSeed
                  }
                }
              ]
            }
          }
        }
      };
      try {
        const { body } = await this.elasticsearchService.search<ElasticSearchResult>(randomSearchQuery);
        const hits = body.hits.hits;
        const totalValue = body.hits.total["value"];
        if (totalValue > 0) {
          hits.map((item) => recommendArr.push(item._source));
        }
      } catch (e) {
        console.log(JSON.stringify(randomSearchQuery));
      }
    }
    resultObj["list"] = recommendArr;
    return resultObj;
  }

  async updateViewCount(productId: number) {
    const updateQuery = {
      index: this.productIndex,
      body: {
        "script" : {
          "source": "ctx._source.viewcnt += 1",
          "lang": "painless"
        },
        "query": {
          "term": {
            "id": productId
          }
        }
      }
    }
    const apiResponse = await this.elasticsearchService.updateByQuery<ElasticUpdateResult>(updateQuery);
  }
}