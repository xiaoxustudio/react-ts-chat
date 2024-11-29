import { Flex } from "antd";
import { ChatItem } from "./type";
import style from "./index.module.less";
import useUserStore from "@/store/useUserStore";
import classNames from "classnames";
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";

interface ChatContainerProp {
	list: ChatItem[];
}
const ChatContainer = forwardRef(
	({ list }: ChatContainerProp, ref: ForwardedRef<any>) => {
		const { username } = useUserStore();
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
					<Flex
						justify={item.send_id === username ? "right" : "left"}
						className={classNames(style.ChatItemBox, {
							[style.user_self]: item.send_id === username,
						})}
						key={index}
						vertical
					>
						<Flex
							className={style.NickName}
							justify={item.send_id === username ? "right" : "left"}
						>
							{item.nickname}
						</Flex>
						<Flex
							className={style.Content}
							justify={item.send_id === username ? "right" : "left"}
						>
							{item.content}
						</Flex>
						<Flex
							className={style.Time}
							justify={item.send_id === username ? "right" : "left"}
						>
							{item.time}
						</Flex>
					</Flex>
				))}
			</Flex>
		);
	}
);

export default ChatContainer;
