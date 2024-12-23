import { Post } from "@/alova";

interface GetFriendProp {
	user: string;
}

function GetFriend({ user }: GetFriendProp) {
	return Post("/api/user/get-friend", { user });
}
export default GetFriend;
