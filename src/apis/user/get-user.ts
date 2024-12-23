import { Post } from "@/alova";

interface GetUserProp {
	user: string;
}

function GetUser({ user }: GetUserProp) {
	return Post("/api/user/get-user", { user });
}
export default GetUser;
