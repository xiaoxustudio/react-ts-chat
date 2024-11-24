import { WsData } from "@/types";

function useSend() {
	return {
		sendWrapper: (s: WsData) => JSON.stringify(s),
	};
}
export default useSend;
