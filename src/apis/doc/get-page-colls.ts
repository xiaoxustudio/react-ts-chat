import { Post } from '@/alova';

interface GetPageCollsProp {
    block: string;
}

function GetPageColls({ block }: GetPageCollsProp) {
    return Post('/api/doc/get-page-collaborators', { block });
}
export default GetPageColls;
