import { Post } from '@/alova';

interface SetAuthCollaboratorProp {
    block: string;
    user: string;
    auth: number;
}

function SetAuthCollaborator({ block, user, auth }: SetAuthCollaboratorProp) {
    return Post('/api/doc/set-auth-collaborator', { block, user, auth });
}
export default SetAuthCollaborator;
