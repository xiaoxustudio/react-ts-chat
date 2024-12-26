import { Post } from '@/alova';

export interface GetGroupProp {
    group: string;
}

function GetGroup({ group }: GetGroupProp) {
    return Post('/api/group/get-group', { group });
}
export default GetGroup;
