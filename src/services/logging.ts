import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { clickDate, nowYearMonthDay } from "../utils/util";

@Injectable()
export default class LoggingService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async putDocument(userId: number, name: string, productId: number, price: number,) {
    const index = `logging-${nowYearMonthDay}`;
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
