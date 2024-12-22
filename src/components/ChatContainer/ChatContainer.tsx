import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";
import { Flex } from "antd";
import { ChatItemData } from "./type";
import ChatItem from "./ChatItem";
import style from "./index.module.less";

interface ChatContainerProp {
	list: ChatItemData[];
}
const ChatContainer = forwardRef(
	({ list }: ChatContainerProp, ref: ForwardedRef<any>) => {
		const containerRef = useRef<HTMLDivElement>(null);
		useImperativeHandle(
			ref,
			() => {
				return {
					scrollIntoView() {
						if (containerRef.current) {
							containerRef.current.scrollTop =
								containerRef.current.scrollHeight;
						}
					},
				};
			},
			[]
		);

		return (
			<Flex ref={containerRef} className={style.ChatContainerBox} vertical>
				{list.map((item, index) => (
					<ChatItem key={index} item={item} index={index} />
				))}
			</Flex>
		);
	}
);

export default ChatContainer;
