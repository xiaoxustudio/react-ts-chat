import { Post } from '@/alova';

interface ValidEmailProp {
    user: string;
    code: string;
}

function ValidEmail({ user, code }: ValidEmailProp) {
    return Post('/api/user/valid-email', { user, code });
}
export default ValidEmail;
