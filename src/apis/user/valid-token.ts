import { Post } from "@/alova";

interface ValidTokenProp {
	token: string;
}

function ValidToken({ token }: ValidTokenProp) {
	return Post("/api/user/valid-token", { token });
}
export default ValidToken;
