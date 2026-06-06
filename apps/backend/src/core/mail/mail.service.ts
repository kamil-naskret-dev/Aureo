import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { MAIL_JOBS, MAIL_QUEUE, MailJobName } from './mail.constants';
import {
  MailJobDataMap,
  ResetPasswordJobData,
  VerifyEmailJobData,
} from './mail.types';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue<
      MailJobDataMap[MailJobName],
      void,
      MailJobName
    >,
  ) {}

  async sendVerificationEmail(
    to: string,
    verificationUrl: string,
  ): Promise<void> {
    await this.mailQueue.add(MAIL_JOBS.VERIFY_EMAIL, {
      to,
      verificationUrl,
    } satisfies VerifyEmailJobData);
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    await this.mailQueue.add(MAIL_JOBS.RESET_PASSWORD, {
      to,
      resetUrl,
    } satisfies ResetPasswordJobData);
  }
}
