import { create } from "zustand";
type ServerAlive = 0 | 1;

interface ServerStatus {
	status: ServerAlive;
	setStatus: (state: ServerAlive) => void;
}

const useServerStatus = create<ServerStatus>()((set) => ({
	status: 0,
	setStatus: (newVal) =>
		set(() => ({
			status: newVal,
		})),
}));
export default useServerStatus;
