import { Post } from '@/alova';

export interface GetGroupMembersProp {
    group: string;
}

function GetGroupMembers({ group }: GetGroupMembersProp) {
    return Post('/api/group/get-group-members', { group });
}
export default GetGroupMembers;
