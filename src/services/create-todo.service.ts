import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CalendarEvent, google} from 'calendar-link';
import {Variables} from 'camunda-external-task-client-js';
import {CamundaHandlerParams} from '../interfaces/CamundaHandlerParams';
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
      const title = task.variables.get('title');
      const duration = task.variables.get('duration');
      const allDay = task.variables.get('allDay');
      const start = task.variables.get('start');
      const guests = task.variables.get('guests');
      if (!title || title === '') {
        taskService.handleFailure(task, {
          errorMessage: 'Title is required',
        });
        return;
      }
      const todo = new TodoModel({
        title,
        description: task.variables.get('description'),
        duration,
        allDay,
        start,
        guests,
        isDone: false,
      });
      this.todoModelRepository.create(todo);
      await taskService.complete(task);
      console.log('TODO saved successfully');
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  };

  createEvent = async ({task, taskService}: CamundaHandlerParams) => {
    try {
      const title = task.variables.get('title');
      const description = task.variables.get('description');
      const duration = task.variables.get('duration');
      const allDay = task.variables.get('allDay');
      const start = task.variables.get('start');
      let guests = task.variables.get('guests');
      guests = typeof guests === 'string' ? JSON.parse(guests) : guests;
      const event: CalendarEvent = {
        title,
        description,
        start,
        duration: allDay ? null : duration,
        guests,
        allDay,
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
      const title = task.variables.get('title');
      let guests = task.variables.get('guests');
      guests = typeof guests === 'string' ? JSON.parse(guests) : guests;

      // Then fetch the link
      await this.emailService.send(guests, title, url);
      console.log('EMAIL SENT');
      await taskService.complete(task);
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  };
}
