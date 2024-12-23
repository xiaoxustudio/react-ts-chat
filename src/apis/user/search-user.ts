import { Post } from "@/alova";

interface SearchUserProp {
	nickname: string;
}

function SearchUser({ nickname }: SearchUserProp) {
	return Post("/api/user/search-users", { nickname });
}
export default SearchUser;
