import {
  Column,
  DataType,
  HasMany,
  Index,
  IsEmail,
  Model,
  Table,
} from 'sequelize-typescript';
import { Journal } from 'src/journals/entities/journal.entity';
import { LedgerEntry } from 'src/ledger-entries/entities/ledger-entry.entity';
import { Ledger } from 'src/ledgers/entities/ledger.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum UserSource {
  GOOGLE = 'GOOGLE',
}

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends AuditableTable<User> {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  id: string;

  @IsEmail
  @Column({
    type: DataType.STRING(120),
    allowNull: false,
    get(this: User): string {
      return this.getDataValue('email')?.toLowerCase();
    },
    set(this: User, val: string): void {
      this.setDataValue('email', val?.toLocaleLowerCase());
    },
  })
  @Index({
    unique: true,
  })
  email: string;

  @Column({ type: DataType.STRING(120) })
  firstName: string;

  @Column({ type: DataType.STRING(120) })
  lastName: string;

  @Column({
    type: DataType.ENUM(
      UserStatus.ACTIVE,
      UserStatus.INACTIVE,
      UserStatus.DELETED,
    ),
    allowNull: false,
    defaultValue: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: DataType.ENUM(UserSource.GOOGLE),
    allowNull: false,
    defaultValue: UserSource.GOOGLE,
  })
  source: UserSource;

  @HasMany(() => Ledger, 'firstPeerId')
  firstPeerLedgers: Ledger[];

  @HasMany(() => Ledger, 'secondPeerId')
  secondPeerLedgers: Ledger[];

  @HasMany(() => LedgerEntry, 'ownerId')
  ownerLedgerEntries: LedgerEntry[];

  @HasMany(() => LedgerEntry, 'payerId')
  payerLedgerEntries: LedgerEntry[];

  @HasMany(() => Journal, 'ownerId')
  ownerJournal: Journal[];

  @HasMany(() => Journal, 'payerId')
  payerJournal: Journal[];
}
