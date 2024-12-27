import { Post } from '@/alova';

export interface KickMemberProp {
    group: string;
    user: string;
}

function KickMember(data: KickMemberProp) {
    return Post('/api/group/kick-member', data);
}
export default KickMember;
