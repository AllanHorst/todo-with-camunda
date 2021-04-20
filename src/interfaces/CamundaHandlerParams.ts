import {Task, TaskService} from 'camunda-external-task-client-js';

export interface CamundaHandlerParams {
  task: Task;
  taskService: TaskService;
}
