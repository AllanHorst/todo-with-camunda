import {Entity, model, property} from '@loopback/repository';

@model()
export class TodoModel extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    jsonSchema: {
      examples: '2021-11-05 19:00:00 +0300',
    },
  })
  start?: string;

  @property({
    type: 'string',
  })
  duration?: string;

  @property({
    type: 'string',
  })
  guests?: string;

  @property({
    type: 'boolean',
  })
  allDay?: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isDone: boolean;

  constructor(data?: Partial<TodoModel>) {
    super(data);
  }
}

export interface TodoModelRelations {
  // describe navigational properties here
}

export type TodoModelWithRelations = TodoModel & TodoModelRelations;
