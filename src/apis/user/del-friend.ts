import { Post } from "@/alova";

interface DelFriendProp {
	user: string;
}

function DelFriend({ user }: DelFriendProp) {
	return Post("/api/user/delete-friend", { user });
}
export default DelFriend;
