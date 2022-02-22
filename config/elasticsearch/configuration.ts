import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import {
  ApiResponse,
  Context,
  RequestBody,
  RequestNDBody,
  TransportRequestOptions,
  TransportRequestPromise,
} from '@elastic/elasticsearch/lib/Transport';
import * as RequestParams from '@elastic/elasticsearch/api/requestParams';
import { ResponseError } from '@elastic/elasticsearch/lib/errors';

@Injectable()
export class EsConfiguration {
  private readonly logger = new Logger(EsConfiguration.name);
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      nodes: configService.get('ELASTICSEARCH_HOST'),
      requestTimeout: parseInt(configService.get('ELASTICSEARCH_TIMEOUT')),
    });
  }

  async index<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(params?: RequestParams.Index, options?: TransportRequestOptions) {
    try {
      return this.client.index(params, options).catch(err => {
        this.logger.error(err);
        throw err;
      });
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`index ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`index error | ${err.message}`, 500);
    }
  }

  async bulk<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(params?: RequestParams.Bulk, options?: TransportRequestOptions) {
    try {
      return await this.client.bulk(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`bulk ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`bulk error | ${err.message}`, 500);
    }
  }

  async scroll(params) {
    try {
      return await this.client.scroll(params);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`scroll ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`scroll error | ${err.message}`, 500);
    }
  }

  async search<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.Search<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.search<TResponse, TRequestBody, TContext>(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`search ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`search error | ${err.message}`, 500);
    }
  }

  async msearch<
    TResponse = Record<string, any>,
    TRequestBody extends RequestNDBody = Record<string, any>[],
    TContext = Context
  >(
    params?: RequestParams.Msearch<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.msearch<TResponse, TRequestBody, TContext>(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`msearch ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`msearch error | ${err.message}`, 500);
    }
  }

  async count<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.Count<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.count<TResponse, TRequestBody, TContext>(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`count ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`count error | ${err.message}`, 500);
    }
  }

  async get<TResponse = Record<string, any>, TContext = Context>(
    params?: RequestParams.Get,
    options?: TransportRequestOptions
  ) {
    try {
      return await this.client.get<TResponse, TContext>(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        return;
      }
      throw new HttpException(`get error | ${err.message}`, 500);
    }
  }

  async mget<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.Mget<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    return this.client.mget<TResponse, TRequestBody, TContext>(params, options);
  }

  async refreshIndex(indexName) {
    try {
      return this.client.indices.refresh({
        index: indexName,
      });
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`refresh ResponseError | ${err.message} | ${indexName}`, 500);
      }
      throw new HttpException(`refresh error | ${err.message}`, 500);
    }
  }

  async deleteByQuery<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.DeleteByQuery<TRequestBody>,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.deleteByQuery(params);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`deleteByQuery ResponseError | ${err.message} |  ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`deleteByQuery error | ${err.message}`, 500);
    }
  }

  // alias.util.ts 관련
  /*
   * [indices][exists] : Check Exists Index
   * @param indexName : 존재여부를 확인하고 싶은 index명
   * */
  async indicesExists<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.IndicesExists,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.indices.exists(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`indicesExists ResponseError | ${err.message} |  ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`indicesExists error | ${err.message}`, 500);
    }
  }

  /*
   * [cat][indices] : Get Indices List
   * @param indexName : 최신 Index명을 확인하고 싶은 Index명(ex. v1-index-)
   * - v1-index-YYYY.mm.dd 일 경우, v1-index-*로 검색하여 오름차순으로 정렬된 index목록이 리턴된다.
   * */
  async catIndices<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.CatIndices,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.cat.indices(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`catIndices ResponseError | ${err.message} |  ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`catIndices error | ${err.message}`, 500);
    }
  }

  async updateAlias<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.IndicesUpdateAliases,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.indices.updateAliases(params);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`updateAlias ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`updateAlias error | ${err.message}`, 500);
    }
  }

  async closeIndices<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.IndicesClose,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.indices.close(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`closeIndices ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`closeIndices error | ${err.message}`, 500);
    }
  }

  async deleteIndices<
    TResponse = Record<string, any>,
    TRequestBody extends RequestBody = Record<string, any>,
    TContext = Context
  >(
    params?: RequestParams.IndicesDelete,
    options?: TransportRequestOptions
  ): Promise<TransportRequestPromise<ApiResponse<TResponse, TContext>>> {
    try {
      return await this.client.indices.delete(params, options);
    } catch (err) {
      if (err instanceof ResponseError) {
        throw new HttpException(`deleteIndices ResponseError | ${err.message} | ${JSON.stringify(params)}`, 500);
      }
      throw new HttpException(`deleteIndices error | ${err.message}`, 500);
    }
  }
}
