import { Injectable } from '@nestjs/common';
import * as requestIp from 'request-ip';
import { Request } from 'request-ip';
import * as maxmind from 'maxmind';
import { CityResponse } from 'maxmind';
import * as moment from 'moment';
import 'moment-timezone';
import { ElasticsearchService } from '@nestjs/elasticsearch';

moment.tz.setDefault('Asia/Seoul');
const nowDate = moment().format('YYYYMMDD');
const alias = 'logging';


@Injectable()
export default class LoggingService {
  index = `logging-${nowDate}`;

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {
  }

  async putDocument(req: Request, userId: string, name: string, productId: number, price: number) {
    const clientIp = requestIp.getClientIp(req);
    const lookup = await maxmind.open('flies/GeoLite2-City/GeoLite2-City.mmdb');
    const location: CityResponse = lookup.get('59.13.28.124');

    // const inputObj: RequestParams.Bulk = {
    //   index: this.index,
    //   body: [{
    //     'userId': userId,
    //     'name': name,
    //     'id': productId,
    //     'price': price,
    //     'city': location.city.names.en,
    //     'country': location.registered_country.names.en,
    //     "continent": location.registered_country.names.en
    //   }]
    // };
    // return this.elasticsearchService.bulk(inputObj);

    const dataset = [{
      'userId': userId,
      'name': name,
      'id': productId,
      'price': price,
      'city': location.city.names.en,
      'country': location.registered_country.names.en,
      'continent': location.registered_country.names.en,
    }];

    const body = dataset.flatMap(doc => [{ index: { _index: this.index } }, doc]);
    try {
      const response = await this.elasticsearchService.bulk({ refresh: true, body });
      return response.statusCode;
    } catch (e) {
      console.log(e);
    }
  }
}