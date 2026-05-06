import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';

import { MAIL_JOBS, MAIL_QUEUE, MailJobName } from './mail.constants';
import { MailJobDataMap, VerifyEmailJobData } from './mail.types';

@Processor(MAIL_QUEUE, { concurrency: 5 })
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailer: MailerService) {
    super();
  }

  async process(
    job: Job<MailJobDataMap[MailJobName], void, MailJobName>,
  ): Promise<void> {
    switch (job.name) {
      case MAIL_JOBS.VERIFY_EMAIL:
        await this.handleVerifyEmail(job.data);
        break;
      default: {
        this.logger.warn(`Unknown mail job`);
      }
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error): void {
    this.logger.error(
      `Mail job failed permanently: ${job?.name ?? 'unknown'} (id: ${job?.id ?? 'unknown'}) after ${job?.attemptsMade ?? '?'} attempts — ${error.message}`,
      error.stack,
    );
  }

  private async handleVerifyEmail(data: VerifyEmailJobData): Promise<void> {
    this.logger.log(`Sending verification email to ${data.to}`);

    await this.mailer.sendMail({
      to: data.to,
      subject: 'Verify your Aureo account',
      template: 'verify-email/verify-email',
      context: {
        verificationUrl: data.verificationUrl,
        year: new Date().getFullYear(),
      },
    });

    this.logger.log(`Verification email sent to ${data.to}`);
  }
}
