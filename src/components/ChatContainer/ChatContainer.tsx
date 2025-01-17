import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { Flex } from 'antd';
import ChatItem from './ChatItem';
import { ChatItemData } from './type';
import style from './index.module.less';

interface ChatContainerProp {
    list: ChatItemData[];
    type: 'user' | 'group';
}
const ChatContainer = forwardRef(({ list, type }: ChatContainerProp, ref: ForwardedRef<any>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => {
        return {
            scrollIntoView() {
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            },
        };
    }, []);

    return (
        <Flex ref={containerRef} className={style.ChatContainerBox} vertical>
            <div style={{ width: '100%', padding: '20px' }}></div>
            {list.map((item, index) => (
                <ChatItem type={type} key={index} item={item} index={index} />
            ))}
        </Flex>
    );
});

export default ChatContainer;
