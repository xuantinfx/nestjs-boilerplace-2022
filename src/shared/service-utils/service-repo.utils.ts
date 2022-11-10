/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from '@nestjs/common';
import { Op, OrderItem } from 'sequelize';
import { Model, Order } from 'sequelize/types';
import { Literal } from 'sequelize/types/utils';
import { Repository, Sequelize } from 'sequelize-typescript';

import { FindArgs } from '../dtos/common.dtos';

// Technical maxinum limit on paging data
const MAXIMUN_LIMIT_ON_PAGING = parseInt(
  process.env.MAXIMUN_LIMIT_ON_PAGING || '1024',
);

/**
 * Repo utils for a model
 */
export class ServiceRepoUtils {
  /**
   * Find all by argument
   * @param repository Model repo
   * @param args Find argument
   * @param extraConditions Extra conditions to query by specific model
   * @param qColumns column to search. By default, search on column `name`
   * @param customOrder Force a custom order instead of args.order
   * @returns Promise of rows and number of rows
   */
  public static async findAllByArgs<Entity extends Model>(
    repository: Repository<Entity>,
    args: FindArgs,
    extraConditions?: Record<string, any>[],
    qColumns = ['name'],
    customOrder: Order = undefined,
  ): Promise<{ rows: Entity[]; count: number }> {
    let conditions: Record<string, any>[] =
      await ServiceRepoUtils.genCommonFilterCondition(args, qColumns);

    // Optional, extra conditions
    if (extraConditions?.length) {
      // And with more conditions if provided
      conditions = conditions.concat(extraConditions);
    }

    const order = customOrder || ServiceRepoUtils.genSequelizeOrder(args.order);

    return await ServiceRepoUtils.findPageEntities(
      repository,
      conditions,
      args.limit,
      args.offset,
      order,
    );
  }

  private static findPageEntities<Entity extends Model>(
    repository: Repository<Entity>,
    conditions?: Record<string, any>[],
    limit = 100,
    offset = 0,
    order?: Order,
  ): Promise<{ rows: Entity[]; count: number }> {
    const options = {
      where: ServiceRepoUtils.andConditions(conditions),
      limit: Math.min(limit, MAXIMUN_LIMIT_ON_PAGING),
      offset,
      order,
    };

    return repository.findAndCountAll(options);
  }

  /**
   * Find all by argument
   * @param repository Model repo
   * @param args Find argument
   * @param include Model repo
   * @param extraConditions Extra conditions to query by specific model
   * @param qColumns column to search. By default, search on column `name`
   * @param customOrder Force a custom order instead of args.order
   * @returns Promise of rows and number of rows
   */
  public static async findAllByArgsWithInclude<Entity extends Model>(
    repository: Repository<Entity>,
    args: FindArgs,
    include?: Record<string, any>[],
    extraConditions?: Record<string, any>[],
    qColumns = ['name'],
    customOrder: Order = undefined,
  ): Promise<{ rows: Entity[]; count: number }> {
    let conditions: Record<string, any>[] =
      await ServiceRepoUtils.genCommonFilterCondition(args, qColumns);

    // Optional, extra conditions
    if (extraConditions?.length) {
      // And with more conditions if provided
      conditions = conditions.concat(extraConditions);
    }

    const order = customOrder || ServiceRepoUtils.genSequelizeOrder(args.order);

    return await ServiceRepoUtils.findPageEntitiesWithInclude(
      repository,
      conditions,
      include,
      args.limit,
      args.offset,
      order,
    );
  }

  private static findPageEntitiesWithInclude<Entity extends Model>(
    repository: Repository<Entity>,
    conditions?: Record<string, any>[],
    include?: Record<string, any>[],
    limit = 100,
    offset = 0,
    order?: Order,
  ): Promise<{ rows: Entity[]; count: number }> {
    const options = {
      where: ServiceRepoUtils.andConditions(conditions),
      include,
      limit: Math.min(limit, MAXIMUN_LIMIT_ON_PAGING),
      offset,
      order,
    };

    return repository.findAndCountAll(options);
  }

  /**
   * Generate common filter condition
   * @param args FindArgs
   * @param qColumns columns to search entity by `q`
   * @returns List of conditions to query
   */
  private static genCommonFilterCondition(
    args: FindArgs,
    qColumns = ['name'],
  ): Record<string, any>[] {
    const conditions: Record<string, any>[] = [];

    // Filter by "ids" in
    if (args?.ids && args.ids.length > 0) {
      conditions.push({ id: args.ids });
    }

    // Filter by search iLike "q" on column name
    if (args?.q) {
      conditions.push(this.genConditionILike(args.q, qColumns));
    }

    return conditions;
  }

  private static genConditionILike(
    q: unknown,
    columns: string[],
  ): Record<string, any> {
    if (!q || !columns || columns.length === 0) {
      return undefined;
    }

    const strName = new String(q);
    const encode = strName.replace(/%/g, '\\%');
    const conditions = columns.map((column) => {
      return { [column]: { [Op.iLike]: `%${encode}%` } };
    });

    // OR on multi columns or one column
    return conditions.length > 1 ? { [Op.or]: conditions } : conditions[0];
  }

  /**
   * `Op.and` conditions. Return undefined if param is undefined/null
   * @param conditions conditions for where or undefined.
   */
  public static andConditions(
    conditions: Record<string, any>[],
  ): Record<string, any> {
    if (!conditions || conditions.length === 0) {
      return undefined;
    }

    return conditions.length > 1 ? { [Op.and]: conditions } : conditions[0];
  }

  /**
   * `Op.or` conditions. Return undefined if param is undefined/null
   * @param conditions conditions for where or undefined.
   */
  public static orConditions(
    conditions: Record<string, any>[],
  ): Record<string, any> {
    if (!conditions || conditions.length === 0) {
      return undefined;
    }

    return conditions.length > 1 ? { [Op.or]: conditions } : conditions[0];
  }

  /** Return Sequenlize order in format [["name", "ASC"]] */
  public static genSequelizeOrder(argOrder: string): OrderItem[] {
    if (!argOrder) {
      return [];
    }

    const orderColumns = argOrder.split(/\s*,\s*/);
    if (orderColumns.length > 3) {
      throw new BadRequestException(`Order limit by number of column`);
    }

    const order = [];
    for (const orderColumn of orderColumns) {
      const temp = orderColumn.split(/\s*:\s*/);
      const item = [temp[0], temp[1] || 'ASC'];
      order.push(item);
    }

    return order;
  }

  /** Order for matching startWith: `${column} ILIKE ${q} ${operator}`*/
  public static genSequelizeOrderStartWith(
    column: string,
    q: string,
    operator: 'DESC' | 'ASC',
  ): Literal {
    const strQ = new String(q);
    const encode = strQ.replace(/%/g, '\\%');

    const orderQStartWith: Literal = Sequelize.literal(
      `${column} ILIKE '${encode}%' ${operator}`,
    );

    return orderQStartWith;
  }
}
