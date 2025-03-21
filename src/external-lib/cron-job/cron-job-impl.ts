import { CronJob as CronJobLib } from 'cron';
import { CronFn, CronJob, CronJobOptions } from '../../shared/abstractions';

export class CronJobImpl implements CronJob {
  private job: CronJobLib<CronFn>;
  private running: boolean = false;

  initialize(options: CronJobOptions) {
    if (options.start) {
      this.running = true;
    }

    this.job = CronJobLib.from({
      onTick: options.job,
      start: options.start,
      timeZone: options.timeZone,
      onComplete: options.onComplete,
      cronTime: options.cronExpression,
    });
  }

  start(): void {
    if (!this.running) {
      this.job.start();
      this.running = true;
    }
  }

  stop(): void {
    if (this.running) {
      this.job.stop();
      this.running = false;
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}
