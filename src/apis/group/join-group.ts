import { Post } from '@/alova';

export interface JoinGroupProp {
    group: string;
}

function JoinGroup({ group }: JoinGroupProp) {
    return Post('/api/group/join-group', { group });
}
export default JoinGroup;
