import { Post } from '@/alova';

export interface GetGroupMemberProp {
    group: string;
    user: string;
}

function GetGroupMember(data: GetGroupMemberProp) {
    return Post('/api/group/get-group-member', data);
}
export default GetGroupMember;
