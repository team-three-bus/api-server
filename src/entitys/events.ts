import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne
} from 'typeorm';
import { ProductsEntity } from './products';

@Entity('events')
export class EventsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => ProductsEntity, product => product.events)
  products: ProductsEntity[];

  @Column()
  productId: string;

  @Column()
  eventType: string;

  @Column()
  eventYear: string;

  @Column()
  eventMonth: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
