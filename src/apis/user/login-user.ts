import { Post } from "@/alova";
import { LoginData } from "@/types";

export interface LoginUserProp {
	username: string;
	password: string;
}

function LoginUser({ username, password }: LoginUserProp) {
	return Post<LoginData>("/api/user/login", { username, password });
}
export default LoginUser;
