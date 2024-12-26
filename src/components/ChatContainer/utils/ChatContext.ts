import { createContext } from 'react';

interface ChatContextProp {
    group_id?: string;
    onWidthDraw?: (data: { target?: string; index: number }) => void;
}

const ChatContext = createContext<ChatContextProp>({});
export default ChatContext;
