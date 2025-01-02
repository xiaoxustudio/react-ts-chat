import { Post } from '@/alova';

interface InvitePeopleProp {
    users: string[];
    block: string;
}

function InvitePeople({ users, block }: InvitePeopleProp) {
    return Post('/api/doc/invite-people', { users, block });
}
export default InvitePeople;
