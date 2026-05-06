import { MAIL_JOBS } from './mail.constants';

export interface VerifyEmailJobData {
  to: string;
  verificationUrl: string;
}

export type MailJobDataMap = {
  [MAIL_JOBS.VERIFY_EMAIL]: VerifyEmailJobData;
};
