import { Injectable } from '@nestjs/common';

import {
  MailNotificationData,
  Notification,
  NotificationChannel,
  NotificationRecipient,
} from './notifications.types';
import { MailChannel } from './channels/mail.channel';

@Injectable()
export class NotificationsService {
  private readonly channels: Map<string, NotificationChannel>;

  constructor(private readonly mail: MailChannel) {
    this.channels = new Map([['mail', this.mail]]);
  }

  async send(
    recipient: NotificationRecipient,
    notification: Notification,
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const channelType of notification.channels) {
      const channel = this.channels.get(channelType);
      if (!channel) continue;

      let data: MailNotificationData | undefined;

      if (channelType === 'mail') {
        data = notification.toMail?.();
      }

      if (!data) continue;

      promises.push(channel.send(recipient, data));
    }

    await Promise.all(promises);
  }
}
