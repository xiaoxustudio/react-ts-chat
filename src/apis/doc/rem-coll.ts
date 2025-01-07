import { Post } from '@/alova';

interface RemoveCollProp {
    block: string;
    user: string;
}

function RemoveColl({ block, user }: RemoveCollProp) {
    return Post('/api/doc/remove-collaborator', { block, user });
}
export default RemoveColl;
