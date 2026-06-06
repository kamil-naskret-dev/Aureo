import { Notification, MailNotificationData } from '../notifications.types';

export class ResetPasswordNotification implements Notification {
  readonly channels = ['mail'] as const;

  constructor(private readonly resetUrl: string) {}

  toMail(): MailNotificationData {
    return {
      subject: 'Reset your Aureo password',
      template: 'reset-password/reset-password',
      context: {
        resetUrl: this.resetUrl,
        year: new Date().getFullYear(),
      },
    };
  }
}
