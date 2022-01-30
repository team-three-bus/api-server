import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EventsEntity } from '../entitys/events';

@Injectable()
export class EventsDao {
  constructor(
    @InjectRepository(EventsEntity)
    private eventsRepository: Repository<EventsEntity>,
  ) {}

  public async getGoingEventIdList(eventYear: string, eventMonth: string, eventTypeList: string[]): Promise<EventsEntity[]> {
    return this.eventsRepository.find({
      where: {
        eventYear: eventYear,
        eventMonth: eventMonth,
        eventType: In(eventTypeList)
      },
      select: ['productId']
    });
  }
}