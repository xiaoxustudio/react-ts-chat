import { Post } from '@/alova';

interface SendEmailProp {
    email: string;
}

function SendEmail({ email }: SendEmailProp) {
    return Post('/api/user/send-email', { email });
}
export default SendEmail;
