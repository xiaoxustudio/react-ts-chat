import { Post } from "@/alova";

interface AddFriendProp {
	user: string;
}

function AddFriend({ user }: AddFriendProp) {
	return Post("/api/user/add-friend", { user });
}
export default AddFriend;
