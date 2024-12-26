import { Post } from '@/alova';

export interface SearchGroupProp {
    group: string;
}

function SearchGroup({ group }: SearchGroupProp) {
    return Post('/api/group/search-group', { group });
}
export default SearchGroup;
