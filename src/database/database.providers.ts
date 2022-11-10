import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import { Journal } from 'src/journals/entities/journal.entity';
import { LedgerEntry } from 'src/ledger-entries/entities/ledger-entry.entity';
import { Ledger } from 'src/ledgers/entities/ledger.entity';
import { GroupOrder } from 'src/order/entities/group-order.entity';
import { UserOrderItem } from 'src/order/entities/user-order-item.entity';
import { UserOrder } from 'src/order/entities/user-order.entity';
import { User } from './../user/user.entity';

const logger = new Logger();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres' as Dialect,
        host: process.env.DATABASE_HOST || 'localhost',
        port: +process.env.DATABASE_PORT || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'EatFirstPayLater',
        database: process.env.DATABASE_DATABASE || 'group_order',
        logging: process.env.SQL_LOGGING
          ? process.env.SQL_LOGGING === 'true'
          : false,
        define: {
          underscored: false,
          freezeTableName: true,
        },
      });

      sequelize.addModels([
        User,
        Ledger,
        LedgerEntry,
        Journal,
        GroupOrder,
        UserOrder,
        UserOrderItem,
      ]);

      if (process.env.SYNC_MODEL === 'true') {
        logger.warn('Do sync db');
        await sequelize.sync();
      }

      return sequelize;
    },
    inject: [],
  },
];
