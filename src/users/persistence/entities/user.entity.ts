import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';
import { RoleEntity } from '../../../roles/persistence/entities/role.entity';
import { StatusEntity } from '../../../statuses/persistence/entities/status.entity';

import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../utils/relational-entity-helper';

// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
  })
  @Generated('uuid')
  @Column({ type: String, nullable: false })
  altirevId: string;

  @ApiProperty({
    type: String,
  })
  @Column({ type: String, nullable: true })
  tenantId: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @ApiProperty({
    type: () => String,
  })
  photo?: string | null;

  @ApiProperty({
    type: () => RoleEntity,
  })
  // @ManyToOne(() => RoleEntity, {
  //   eager: true,
  // })
  role?: RoleEntity | null;

  @ApiProperty({
    type: String,
    example: 'bambam4sure',
  })
  @Column({ type: String, nullable: true })
  username: string | null;

  @ApiProperty({
    type: String,
    example: '+234855478989',
  })
  @Column({ type: String, nullable: true })
  phoneNumber: string | null;

  @ApiProperty({
    type: String,
    example: 'male | female',
  })
  @Column({ type: String, nullable: true })
  gender: string | null;

  @ApiProperty({
    type: String,
    example: 'Abuja',
  })
  @Column({ type: String, nullable: true })
  state: string | null;

  @ApiProperty({
    type: String,
    example: 'Nigeria',
  })
  @Column({ type: String, nullable: true })
  country: string | null;

  @ApiProperty({
    type: () => StatusEntity,
  })
  // @ManyToOne(() => StatusEntity, {
  //   eager: true,
  // })
  status?: StatusEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
