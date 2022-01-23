import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  // @Column()
  // status: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
