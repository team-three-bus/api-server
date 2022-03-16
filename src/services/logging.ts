import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import * as moment from "moment";
import "moment-timezone";

moment.tz.setDefault('Asia/Seoul');

@Injectable()
export default class LoggingService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async putDocument(userId: number, name: string, productId: number, price: number,) {
    const nowYearMonthDay = moment().format('YYYYMMDD');
    const clickDateHour = moment().format('YYYY-MM-DD HH:mm:ss');
    const index = `logging-${nowYearMonthDay}`;
    const dataset = [
      {
        userId: userId,
        productName: name,
        productId: productId,
        price: price,
        clickDate: clickDateHour,
      },
    ];

    console.log();

    const body = dataset.flatMap((doc) => [{ index: { _index: index } }, doc]);
    try {
      await this.elasticsearchService.bulk({ refresh: true, body });
    } catch (e) {
      console.log(e);
    }
  }
}
