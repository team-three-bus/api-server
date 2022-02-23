import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import 'moment-timezone';
import { ElasticsearchService } from '@nestjs/elasticsearch';
moment.tz.setDefault('Asia/Seoul');


@Injectable()
export default class LoggingService {

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {
  }

  async putDocument(userId: number, name: string, productId: number, price: number) {
    const nowDate = moment().format('YYYYMMDD');
    const index = `logging-${nowDate}`;
    const clickDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const dataset = [{
      'userId': userId,
      'productName': name,
      'productId': productId,
      'price': price,
      'clickDate': clickDate
    }];

    const body = dataset.flatMap(doc => [{ index: { _index: index } }, doc]);
    try {
      await this.elasticsearchService.bulk({ refresh: true, body });
    } catch (e) {
      console.log(e);
    }
  }
}