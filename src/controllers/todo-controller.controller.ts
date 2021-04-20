import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TodoModel} from '../models';
import {TodoModelRepository} from '../repositories';

export class TodoControllerController {
  constructor(
    @repository(TodoModelRepository)
    public todoModelRepository : TodoModelRepository,
  ) {}

  @post('/todos')
  @response(200, {
    description: 'TodoModel model instance',
    content: {'application/json': {schema: getModelSchemaRef(TodoModel)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoModel, {
            title: 'NewTodoModel',
            exclude: ['id'],
          }),
        },
      },
    })
    todoModel: Omit<TodoModel, 'id'>,
  ): Promise<TodoModel> {
    return this.todoModelRepository.create(todoModel);
  }

  @get('/todos/count')
  @response(200, {
    description: 'TodoModel model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TodoModel) where?: Where<TodoModel>,
  ): Promise<Count> {
    return this.todoModelRepository.count(where);
  }

  @get('/todos')
  @response(200, {
    description: 'Array of TodoModel model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TodoModel, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TodoModel) filter?: Filter<TodoModel>,
  ): Promise<TodoModel[]> {
    return this.todoModelRepository.find(filter);
  }

  @patch('/todos')
  @response(200, {
    description: 'TodoModel PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoModel, {partial: true}),
        },
      },
    })
    todoModel: TodoModel,
    @param.where(TodoModel) where?: Where<TodoModel>,
  ): Promise<Count> {
    return this.todoModelRepository.updateAll(todoModel, where);
  }

  @get('/todos/{id}')
  @response(200, {
    description: 'TodoModel model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TodoModel, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TodoModel, {exclude: 'where'}) filter?: FilterExcludingWhere<TodoModel>
  ): Promise<TodoModel> {
    return this.todoModelRepository.findById(id, filter);
  }

  @patch('/todos/{id}')
  @response(204, {
    description: 'TodoModel PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoModel, {partial: true}),
        },
      },
    })
    todoModel: TodoModel,
  ): Promise<void> {
    await this.todoModelRepository.updateById(id, todoModel);
  }

  @put('/todos/{id}')
  @response(204, {
    description: 'TodoModel PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todoModel: TodoModel,
  ): Promise<void> {
    await this.todoModelRepository.replaceById(id, todoModel);
  }

  @del('/todos/{id}')
  @response(204, {
    description: 'TodoModel DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoModelRepository.deleteById(id);
  }
}
