import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsEntity } from '../entitys/events';

@Module({
  imports: [TypeOrmModule.forFeature([EventsEntity])],
})
export class EventsModule {}
