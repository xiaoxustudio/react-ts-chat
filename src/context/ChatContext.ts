import { UserInfo } from "@/types";
import { createContext } from "react";

interface ChatContextProp {
	selectPeople?: UserInfo;
}

const ChatContext = createContext<ChatContextProp>({});
export default ChatContext;
