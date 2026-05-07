import { MAIL_JOBS } from './mail.constants';

export interface VerifyEmailJobData {
  to: string;
  verificationUrl: string;
}

export interface ResetPasswordJobData {
  to: string;
  resetUrl: string;
}

export type MailJobDataMap = {
  [MAIL_JOBS.VERIFY_EMAIL]: VerifyEmailJobData;
  [MAIL_JOBS.RESET_PASSWORD]: ResetPasswordJobData;
};
