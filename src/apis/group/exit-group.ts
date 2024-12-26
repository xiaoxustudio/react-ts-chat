import { Post } from '@/alova';

export interface ExitGroupProp {
    group: string;
}

function ExitGroup({ group }: ExitGroupProp) {
    return Post('/api/group/exit-group', { group });
}
export default ExitGroup;
