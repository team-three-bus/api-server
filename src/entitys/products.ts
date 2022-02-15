import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProductAttrEntity } from './productAttr';
import { EventsEntity } from './events';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column()
  brand: string;

  @Index()
  @Column()
  price: number;

  @Column()
  category: string;

  @Column()
  isEvent: boolean;

  @Column({default: 0})
  viewCnt: number;

  @Column({default: 0})
  likeCnt: number;

  @Column()
  imageUrl: string;

  @OneToOne(() => ProductAttrEntity, (productAttr) => productAttr.product)
  productAttr: ProductAttrEntity;

  @OneToMany(type => EventsEntity, events => events.products)
  events: EventsEntity[];

  @Index()
  @Column()
  lastEventType: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
