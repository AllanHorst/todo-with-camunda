import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TodoModel, TodoModelRelations} from '../models';

export class TodoModelRepository extends DefaultCrudRepository<
  TodoModel,
  typeof TodoModel.prototype.id,
  TodoModelRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TodoModel, dataSource);
  }
}
