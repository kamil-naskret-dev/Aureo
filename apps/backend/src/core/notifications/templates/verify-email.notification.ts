import { Notification, MailNotificationData } from '../notifications.types';

export class VerifyEmailNotification implements Notification {
  readonly channels = ['mail'] as const;

  constructor(private readonly verificationUrl: string) {}

  toMail(): MailNotificationData {
    return {
      subject: 'Verify your Aureo account',
      template: 'verify-email/verify-email',
      context: {
        verificationUrl: this.verificationUrl,
        year: new Date().getFullYear(),
      },
    };
  }
}
