import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import 'moment-timezone';
import { ElasticsearchService } from '@nestjs/elasticsearch';
moment.tz.setDefault('Asia/Seoul');
const alias = 'logging';

@Injectable()
export default class LoggingService {
  nowDate = moment().format('YYYYMMDD');
  index = `logging-${this.nowDate}`;

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async putDocument(
    userId: string,
    name: string,
    productId: number,
    price: number,
  ) {
    const clickDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const dataset = [
      {
        userId: userId,
        productName: name,
        productId: productId,
        price: price,
        clickDate: clickDate,
      },
    ];

    const body = dataset.flatMap((doc) => [{ index: { _index: index } }, doc]);
    try {
      await this.elasticsearchService.bulk({ refresh: true, body });
    } catch (e) {
      console.log(e);
    }
  }
}
