import { createContext } from "react";

interface ChatContextProp {
	onWidthDraw?: (target: string, index: number) => void;
}

const ChatContext = createContext<ChatContextProp>({});
export default ChatContext;
