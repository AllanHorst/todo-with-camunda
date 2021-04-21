import {Task, TaskService} from 'camunda-external-task-client-js';

export interface CamundaHandlerParams {
  task: Task;
  taskService: TaskService;
}

export interface TaskParams {
  title: string;
  description: string;
  duration: [number, any];
  allDay: boolean;
  start: string;
  guests: string;
}
