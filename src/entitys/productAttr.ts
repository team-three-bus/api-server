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
} from 'typeorm';
import { ProductsEntity } from './products';

@Entity('product_attr')
export class ProductAttrEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => ProductsEntity, (product) => product.productAttr)
  product: ProductsEntity;

  @Index()
  @Column()
  productId: string;

  @Column()
  category: string;

  @Index()
  @Column()
  firstAttr: string;

  @Index()
  @Column()
  secondAttr: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
