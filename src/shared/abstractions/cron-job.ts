export type CronFn = () => void | Promise<void>;

export type CronJobOptions = {
  cronExpression: string;
  job: CronFn;
  onComplete?: CronFn;
  timeZone?: string;
  start?: boolean;
};

export abstract class CronJob {
  abstract initialize(options: CronJobOptions): void;
  abstract start(): void;
  abstract stop(): void;
  abstract isRunning(): boolean;
}
