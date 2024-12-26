import { Post } from '@/alova';

export interface GetJoinGroupProp {
    user: string;
}

function GetJoinGroup({ user }: GetJoinGroupProp) {
    return Post('/api/group/get-join-group', { user });
}
export default GetJoinGroup;
