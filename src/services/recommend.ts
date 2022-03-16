import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import {
  ElasticAggregationsResult,
  ElasticLoggingResult,
  ElasticSearchResult,
  ElasticUpdateResult
} from "../interface/elasticSearchResult";
import { changeFormat, nowMonth, nowYear, sortObj } from "../utils/util";
import { ProductsEntity } from "../entitys/products";
import { ElasticAggResult, ElasticRecommendObject } from "../interface/elasticAggResult";

@Injectable()
export default class RecommendService {
  loggingIndex = "logging-*"
  productIndex = `products-${nowYear}-${nowMonth}`

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {
  }

  async getUserClickProducts(userId: number) {
    const getClickProductsQuery = {
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
                  "size": 100000
                }
              }
            }
          }
        }
      }
    };
    const result = await this.elasticsearchService.search<ElasticAggregationsResult>(getClickProductsQuery);
    if (result.body.aggregations.user.buckets.length > 0) {
      // 있으면 상품리스트들을 쭉 던진다.
      const buckets = result.body.aggregations.user.buckets[0].productclick.buckets;
      return result.body.aggregations.user.buckets[0].productclick.buckets;
    } else {
      // 없으면 빈 배열 리턴
      return [];
    }
  }

  async extractProducts(likeList: Array<ProductsEntity>, clickList: Array<ElasticAggResult>, userId: number) {
    let productsArr: Array<ElasticRecommendObject> = [];
    if (likeList.length > 0) {
      for (const product of likeList) {
        let tempObj: ElasticRecommendObject | any = {};
        tempObj.productId = product.id;
        tempObj.point = 2;
        tempObj.productName = product.name;
        tempObj.updatedAt = changeFormat(product.updatedAt);
        productsArr.push(tempObj);
      }
    }
    if (clickList.length > 0) {
      for (const clickObj of clickList) {
        let tempObj: ElasticRecommendObject | any = {};
        const productId = clickObj.key;
        const matchPoint = clickObj.doc_count * 2;
        const getClickProductsQuery = {
          index: this.loggingIndex,
          body: {
            "size": 1,
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {
                      "userId": userId
                    }
                  },
                  {
                    "match": {
                      "productId": productId
                    }
                  }
                ]
              }
            },
            "sort": [
              {
                "clickDate": {
                  "order": "desc"
                }
              }
            ]
          }
        };
        const { body } = await this.elasticsearchService.search<ElasticLoggingResult>(getClickProductsQuery);
        const totalValue = body.hits.total["value"];
        const clickProduct = body.hits.hits[0]._source
        if (totalValue > 0) {
          let isUpdate = false;
          for (const product of productsArr) {
            if (product.productId === productId) {
              product.productName = clickProduct.productName;
              product.point += matchPoint;
              if(product.updatedAt < clickProduct.clickDate) {
                product.updatedAt = clickProduct.clickDate
              }
              isUpdate = true;
            }
          }
          if (isUpdate === false) {
            tempObj.productName = clickProduct.productName;
            tempObj.productId = productId;
            tempObj.point = matchPoint;
            tempObj.updatedAt = clickProduct.clickDate;
            productsArr.push(tempObj);
          }
        }
      }
    }
    return productsArr;
  }

  async matchProduct(productsArr: Array<ElasticRecommendObject>) {
    productsArr.sort((a, b) => {
      if(a.point === b.point) {
        return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
      } else {
        return b.point - a.point;
      }
    })
    let tempObj = {"list": []};
    for (let i=0; i<2; i++) {
      if(!productsArr[i]) {
        break;
      }
      const matchQuery = {
        index: this.productIndex,
        body: {
          "query": {
            "match": {
              "id": productsArr[i].productId
            }
          }
        }
      };
      const { body } = await this.elasticsearchService.search<ElasticSearchResult>(matchQuery);
      const products = body.hits.hits;
      const totalValue = body.hits.total["value"];
      if (totalValue > 0) {
        const matchProductQuery = {
          index: this.productIndex,
          body: {
            "size": 5,
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {
                      "category": products[0]._source.category
                    }
                  },
                  {
                    "match": {
                      "firstattr": products[0]._source.firstattr
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
        const { body } = await this.elasticsearchService.search<ElasticSearchResult>(matchProductQuery);
        const hits = body.hits.hits;
        const totalValue = body.hits.total["value"];
        if(totalValue >0) {
          hits.map((item) => tempObj["list"].push(item._source))
        }
      }
    }
    tempObj["productCnt"] = tempObj["list"].length;
    return tempObj;
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
    if (result.body.aggregations.user.buckets.length > 0) {
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
        "script": {
          "source": "ctx._source.viewcnt += 1",
          "lang": "painless"
        },
        "query": {
          "term": {
            "id": productId
          }
        }
      }
    };
    const apiResponse = await this.elasticsearchService.updateByQuery<ElasticUpdateResult>(updateQuery);
  }
}