import { Global, Module } from '@nestjs/common';
import { EsConfiguration }  from './configuration';

@Global()
@Module({
  providers: [EsConfiguration],
  exports: [EsConfiguration],
})
export class EsConfigModule {}
