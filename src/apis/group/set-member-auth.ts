import { Post } from '@/alova';

export interface SetMemberAuthProp {
    group: string;
    user: string;
    auth: number;
}

function SetMemberAuth(data: SetMemberAuthProp) {
    return Post('/api/group/set-member-auth', data);
}
export default SetMemberAuth;
