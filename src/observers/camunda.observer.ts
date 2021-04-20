import {lifeCycleObserver, LifeCycleObserver, service} from '@loopback/core';
import {Client, logger} from 'camunda-external-task-client-js';
import dotenv from 'dotenv';
import {CreateTodoService} from '../services';

dotenv.config();

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class CamundaObserver implements LifeCycleObserver {
  constructor(
    @service(CreateTodoService)
    public createTodoService: CreateTodoService,
  ) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    const config = {
      baseUrl: process.env.CAMUNDA_URL || 'http://localhost:8080/engine-rest',
      use: logger,
      asyncResponseTimeout: 10000,
    };
    const client = new Client(config);

    client.subscribe('save-database', this.createTodoService.saveDatabase);
    client.subscribe('create-event', this.createTodoService.createEvent);
    client.subscribe('send-email', this.createTodoService.sendEmail);
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
