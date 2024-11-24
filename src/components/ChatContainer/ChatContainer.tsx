import { Flex } from "antd";
import { ChatItem } from "./type";
import style from "./index.module.less";
import useUserStore from "@/store/useUserStore";

interface ChatContainerProp {
	list: ChatItem[];
}
function ChatContainer({ list }: ChatContainerProp) {
	const { username } = useUserStore();

	return (
		<Flex className={style.ChatContainerBox} vertical>
			{list.map((item, index) => (
				<Flex
					justify={item.send_id === username ? "right" : "left"}
					className={style.ChatItemBox}
					key={index}
					vertical
				>
					<Flex justify={item.send_id === username ? "right" : "left"}>
						{item.nickname}
					</Flex>
					<Flex justify={item.send_id === username ? "right" : "left"}>
						{item.content}
					</Flex>
					<Flex justify={item.send_id === username ? "right" : "left"}>
						{item.time}
					</Flex>
				</Flex>
			))}
		</Flex>
	);
}

export default ChatContainer;
