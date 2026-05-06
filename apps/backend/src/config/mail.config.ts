import { registerAs } from '@nestjs/config';

export interface MailConfig {
  user: string;
  pass: string;
  from: string;
}

export default registerAs(
  'mail',
  (): MailConfig => ({
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
    from: process.env.MAIL_FROM ?? 'Aureo <kamil.naskret.dev@gmail.com>',
  }),
);
