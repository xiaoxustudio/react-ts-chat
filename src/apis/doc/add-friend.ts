import { Post } from '@/alova';

interface GetPagesProp {
    user: string;
}

function GetPages({ user }: GetPagesProp) {
    return Post('/api/doc/get-pages', { user });
}
export default GetPages;
