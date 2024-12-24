import { Avatar, Flex, Image, Popover } from "antd";
import classNames from "classnames";
import { forwardRef, useContext, useState } from "react";
import { ServerUrl } from "@/consts";
import { Content } from "antd/es/layout/layout";
import useUserStore from "@/store/useUserStore";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";
import ChatContext from "./utils/ChatContext";
import type { ChatItemData } from "./type";
import style from "./chat-item.module.less";

interface ChatItemProps {
	item: ChatItemData;
	index: number;
}
interface MenuItemDataProps {
	target: string;
	index: number;
}

function MenuItemData({ target, index }: MenuItemDataProps) {
	const { onWidthDraw } = useContext(ChatContext);
	return (
		<Flex vertical>
			<Content
				className={style.menuBtn}
				onClick={() => onWidthDraw?.(target, index)}
			>
				撤回
			</Content>
		</Flex>
	);
}

const ChatItem = forwardRef<HTMLDivElement, ChatItemProps>((props, ref) => {
	const { item, index, ...reset } = props;
	const { username } = useUserStore();
	const [_, setHover] = useState(false);

	return (
		<Flex
			ref={ref}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			justify={item.send_id === username ? "right" : "left"}
			className={classNames(style.ChatItemBox)}
			vertical
			{...reset}
		>
			{/* 用户名称 */}
			<Flex
				className={style.NickName}
				justify={item.send_id === username ? "right" : "left"}
			>
				{item.send_id !== username && (
					<Avatar
						size="large"
						icon={!item.avatar && <UserOutlined />}
						src={`${ServerUrl}${item.avatar?.slice(1)}`}
					/>
				)}
				{item.nickname}
				{item.send_id === username && (
					<Avatar
						size="large"
						icon={!item.avatar && <UserOutlined />}
						src={`${ServerUrl}${item.avatar?.slice(1)}`}
					/>
				)}
			</Flex>
			{/* 内容 */}
			<Flex
				className={style.Content}
				justify={item.send_id === username ? "right" : "left"}
			>
				{item.content}
			</Flex>
			{/* 附件 */}
			<Flex justify={item.send_id === username ? "right" : "left"}>
				{item.files.map((val) => (
					<Image key={val} width={50} height={50} src={`${ServerUrl}/${val}`} />
				))}
			</Flex>
			{item.files.length > 0 && (
				<Flex
					justify={item.send_id === username ? "right" : "left"}
					style={{ fontSize: "10px", color: "#ccc" }}
				>
					携带文件数：{item.files.length}
				</Flex>
			)}
			{/* 时间 */}
			<Flex
				className={style.Time}
				justify={item.send_id === username ? "right" : "left"}
			>
				{item.send_id === username && (
					<Popover
						trigger="hover"
						placement="left"
						content={<MenuItemData target={item.receive_id} index={index} />}
					>
						<MoreOutlined className={style.menuBtn} />
					</Popover>
				)}
				{item.time}
				{item.send_id !== username && (
					<Popover trigger="hover" placement="right">
						<MoreOutlined className={style.menuBtn} />
					</Popover>
				)}
			</Flex>
		</Flex>
	);
});
export default ChatItem;
