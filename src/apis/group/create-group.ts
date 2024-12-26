import { Post } from '@/alova';

export interface CreateGroupProp {
    group_avatar: string;
    group_name: string;
    group_desc: string;
}

function CreateGroup(data: CreateGroupProp) {
    return Post('/api/group/create-group', data);
}
export default CreateGroup;
