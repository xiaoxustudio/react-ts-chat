import { UserInfo } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface UserToken {
	username: string;
	nickname: string;
	token: string;
	data: Partial<UserInfo>;
	setUserName: (_un: string) => void;
	setNickName: (_un: string) => void;
	setToken: (_un: string) => void;
	setData: (_un: UserInfo) => void;
	resetLogin: () => void;
}

const useUserStore = create<UserToken>()(
	persist(
		(set) => ({
			username: "",
			nickname: "",
			token: "",
			data: {},
			setUserName: (newinfo) => set(() => ({ username: newinfo })),
			setNickName: (newinfo) => set(() => ({ nickname: newinfo })),
			setToken: (newinfo) => set(() => ({ token: newinfo })),
			setData: (newinfo) => set(() => ({ data: newinfo })),
			resetLogin: () =>
				set(() => ({ username: "", nickname: "", token: "", data: {} })),
		}),
		{
			name: "user-info",
		}
	)
);
export default useUserStore;
