import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HeaderProp {
	select: string;
	setSelect: (_un: string) => void;
	reset: () => void;
}

const useHeaderStore = create<HeaderProp>()(
	persist(
		(set) => ({
			select: "",
			setSelect: (newVal) => set({ select: newVal }),
			reset: () => set({ select: "user" }),
		}),
		{
			name: "user-header",
		}
	)
);
export default useHeaderStore;
