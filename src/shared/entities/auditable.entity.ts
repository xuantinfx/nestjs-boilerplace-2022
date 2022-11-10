import {
  Column,
  CreatedAt,
  DataType,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

export abstract class AuditableTable<T> extends Model<T> {
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: () => Date.now(),
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: () => Date.now(),
  })
  updatedAt: Date;

  @Column({ type: DataType.STRING(120), allowNull: true })
  createdBy: string;

  @Column({ type: DataType.STRING(120), allowNull: true })
  updatedBy: string;
}
