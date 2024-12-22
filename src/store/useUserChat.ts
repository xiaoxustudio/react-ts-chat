import { create } from "zustand";
import { persist } from "zustand/middleware";
interface UserChat {
	select: string;
	setSelect: (_un: string) => void;
	reset: () => void;
}

const useUserChat = create<UserChat>()(
	persist(
		(set) => ({
			select: "",
			setSelect: (newinfo) => set(() => ({ select: newinfo })),
			reset: () =>
				set(() => ({
					select: "",
				})),
		}),
		{
			name: "user-chat",
		}
	)
);
export default useUserChat;
