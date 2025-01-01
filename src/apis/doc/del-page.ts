import { Post } from '@/alova';

interface DeletePageProp {
    block: string;
}

function DeletePage({ block }: DeletePageProp) {
    return Post('/api/doc/delete-page', { block });
}
export default DeletePage;
