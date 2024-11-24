import { BreadcrumbProps } from "antd";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type NItem = BreadcrumbProps["items"];
interface UserChat {
	path: NItem;
	select: string;
	setPath: (_un: NItem) => void;
	setSelect: (_un: string) => void;
	reset: () => void;
}

const useUserChat = create<UserChat>()(
	persist(
		(set) => ({
			path: [
				{
					title: "聊天",
					link: "/user",
				},
			],
			select: "",
			setPath: (newinfo) => set(() => ({ path: newinfo })),
			setSelect: (newinfo) => set(() => ({ select: newinfo })),
			reset: () =>
				set(() => ({
					path: [
						{
							title: "聊天",
							link: "/user",
						},
					],
					select: "",
				})),
		}),
		{
			name: "user-chat",
		}
	)
);
export default useUserChat;
