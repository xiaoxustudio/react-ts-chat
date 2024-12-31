import { Post } from '@/alova';

interface CreatePageProp {
    type: number;
}

function CreatePage({ type }: CreatePageProp) {
    return Post('/api/doc/create-page', { type });
}
export default CreatePage;
