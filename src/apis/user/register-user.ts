import { Post } from "@/alova";

interface RegisterUserProp {
	username?: string;
	password?: string;
	repassword?: string;
	email?: string;
}

function RegisterUser(data: RegisterUserProp) {
	return Post("/api/user/register", data);
}
export default RegisterUser;
