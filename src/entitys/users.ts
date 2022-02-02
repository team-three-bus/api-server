import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LikeEntity } from './like';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socialId: string;

  @Column()
  nickname: string;

  @Column()
  platformType: string;

  @Column({nullable: true})
  gender: string;

  @Column({nullable: true})
  ageRange: string;

  @OneToMany(type => LikeEntity, like => like.userId)
  likes: LikeEntity[];
  // @Column()
  // status: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
