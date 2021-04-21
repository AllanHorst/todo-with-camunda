import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CalendarEvent, google} from 'calendar-link';
import {Task, Variables} from 'camunda-external-task-client-js';
import {
  CamundaHandlerParams,
  TaskParams,
} from '../interfaces/CamundaHandlerParams';
import {TodoModel} from '../models';
import {TodoModelRepository} from '../repositories';
import {EmailService} from './email.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CreateTodoService {
  constructor(
    @repository(TodoModelRepository)
    public todoModelRepository: TodoModelRepository,
    @service(EmailService)
    public emailService: EmailService,
  ) {}

  saveDatabase = async ({task, taskService}: CamundaHandlerParams) => {
    try {
      const params = this.getParams(task);
      if (!params.title || params.title === '') {
        taskService.handleFailure(task, {
          errorMessage: 'Title is required',
        });
        return;
      }
      const todo = new TodoModel({
        title: params.title,
        description: params.description,
        duration: JSON.stringify(params.duration),
        allDay: params.allDay,
        start: params.start,
        guests: params.guests,
        isDone: false,
      });
      this.todoModelRepository.create(todo);
      await taskService.complete(task);
      console.log('TODO CREATED');
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  };

  createEvent = async ({task, taskService}: CamundaHandlerParams) => {
    try {
      const params = this.getParams(task);
      const parsedGuests: string[] =
        typeof params.guests === 'string'
          ? JSON.parse(params.guests)
          : params.guests;

      const event: CalendarEvent = {
        ...params,
        duration: params.allDay ? undefined : params.duration,
        guests: parsedGuests,
      };

      // Then fetch the link
      const eventUrl = google(event);
      const variables = new Variables().set('eventUrl', eventUrl);
      await taskService.complete(task, variables);
      console.log('EVENT CREATED');
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  };

  sendEmail = async ({task, taskService}: CamundaHandlerParams) => {
    try {
      const url = task.variables.get('eventUrl');
      let {title, guests} = this.getParams(task);
      guests = typeof guests === 'string' ? JSON.parse(guests) : guests;

      await this.emailService.send(guests[0], title, url);
      console.log('EMAIL SENT');
      await taskService.complete(task);
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  };

  private getParams = (task: Task): TaskParams => ({
    title: task.variables.get('title'),
    description: task.variables.get('description'),
    duration: task.variables.get('duration'),
    allDay: task.variables.get('allDay'),
    start: task.variables.get('start'),
    guests: task.variables.get('guests'),
  });
}
