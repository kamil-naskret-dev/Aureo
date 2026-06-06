export type NotificationChannelType = 'mail';

export interface NotificationRecipient {
  email?: string;
}

export interface MailNotificationData {
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

export interface Notification {
  readonly channels: ReadonlyArray<NotificationChannelType>;
  toMail?(): MailNotificationData;
}

export interface NotificationChannel {
  readonly type: NotificationChannelType;
  send(
    recipient: NotificationRecipient,
    data: MailNotificationData,
  ): Promise<void>;
}
