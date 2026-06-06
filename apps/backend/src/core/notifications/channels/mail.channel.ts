import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import {
  MailNotificationData,
  NotificationChannel,
  NotificationRecipient,
} from '../notifications.types';

@Injectable()
export class MailChannel implements NotificationChannel {
  readonly type = 'mail' as const;

  constructor(private readonly mailer: MailerService) {}

  async send(
    recipient: NotificationRecipient,
    data: MailNotificationData,
  ): Promise<void> {
    await this.mailer.sendMail({
      to: recipient.email,
      subject: data.subject,
      template: data.template,
      context: data.context,
    });
  }
}
