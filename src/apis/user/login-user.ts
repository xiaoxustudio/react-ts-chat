import { LoginData } from "@/types";
import { Post } from "@/alova";

export interface LoginUserProp {
	username: string;
	password: string;
}

function LoginUser({ username, password }: LoginUserProp) {
	return Post<LoginData>("/api/user/login", { username, password });
}
export default LoginUser;
