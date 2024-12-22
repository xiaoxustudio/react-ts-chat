export interface ChatItemData {
	nickname: string; // 昵称
	send_id: string; // 发送方ID
	receive_id: string; // 接收方ID
	content: string; // 消息
	time: string; // 发送时间
	type: string; // 消息类型  Common 901 System 902
	files: string[];
}
