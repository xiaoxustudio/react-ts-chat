import { Flex, message } from "antd";
import Search from "antd/es/input/Search";
import style from "./index.module.less";
import ChatContainer from "@/components/ChatContainer/ChatContainer";
// import { list } from "./mock";
import useUserStore from "@/store/useUserStore";
import { useEffect, useRef, useState } from "react";
import { WsCode, wsUrl } from "@/consts";
import useSend from "@/hook/useSend";
import useServerStatus from "@/store/useServer";
import { useParams } from "react-router-dom";
import { WsData } from "@/types";

function Chat() {
	const { username, token } = useUserStore();
	const { sendWrapper } = useSend();
	const { setStatus } = useServerStatus();
	const [websocketInstance, setWS] = useState<WebSocket | null>();
	const [content, setContent] = useState("");
	const [list, setList] = useState<any[]>([]);
	const params = useParams();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const handleSend = () => {
		if (websocketInstance instanceof WebSocket && content.length > 0) {
			if (websocketInstance.readyState === 1) {
				websocketInstance.send(
					sendWrapper({
						type: WsCode.Send,
						message: content,
					})
				);
				setContent("");
			}
		}
	};
	const scrollbottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollIntoView();
		}
	};
	useEffect(() => {
		let intervalNum: NodeJS.Timeout | number = -1;
		if (websocketInstance instanceof WebSocket) {
			websocketInstance.close();
		}
		const ws = new WebSocket(`${wsUrl}?user=${username}&token=${token}`);
		setWS(ws);
		ws.onopen = () => {
			if (ws.readyState === 1) {
				// 启动心跳
				intervalNum = setInterval(() => {
					if (ws.readyState !== 1) {
						setStatus(0);
						clearInterval(intervalNum);
						message.error("聊天加载失败！");
						return;
					}
					ws.send(
						sendWrapper({
							type: WsCode.HeartBeat,
							message: "HeartBeat",
							data: username,
						})
					);
				}, 1000);
				// 建立连接通道
				ws.send(
					sendWrapper({
						type: WsCode.CreateChannel,
						message: "CreateChannel",
						data: {
							target: params.user_id,
						},
					})
				);
				message.success("连接通信正常！");
			} else {
				message.error("聊天加载失败！");
			}
		};
		ws.onmessage = (e: MessageEvent) => {
			const data = JSON.parse(e.data) as WsData;
			switch (data.type) {
				case WsCode.HeartBeatServer:
					// console.log("接收到服务器心跳：", data);
					setStatus(1);
					break;
				case WsCode.UpdateMsgList:
					console.log("接收到服务器更新数据：", data);
					setList(data.data);
					break;
			}
		};
		ws.onerror = () => {
			message.error("聊天断开失败！");
		};
		scrollbottom();
		return () => {
			ws.close();
			clearInterval(intervalNum);
			setStatus(0);
		};
	}, []);
	useEffect(() => {
		scrollbottom();
	}, [list]);
	return (
		<Flex className={style.ChatBox} vertical>
			<Flex flex={1}>
				<ChatContainer ref={containerRef} list={list} />
			</Flex>
			<Flex>
				<Search
					value={content}
					onChange={(e) => setContent(e.target.value)}
					style={{ width: "100%" }}
					onSearch={handleSend}
					placeholder="请输入要聊天的内容"
					enterButton="发送"
				/>
			</Flex>
		</Flex>
	);
}
export default Chat;
