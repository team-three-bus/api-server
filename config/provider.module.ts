import { Module } from '@nestjs/common';
import { EsConfiguration } from './elasticsearch/configuration';

@Module({
  providers: [EsConfiguration],
  exports: [EsConfiguration],
})
export class ElasticsearchProviderModule {}
