import { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>["items"][number];

export const items: MenuItem[] = [
	{
		type: "divider",
	},
	{
		key: "grp",
		label: "",
		type: "group",
		children: [
			{ key: "chat-people", label: "联系人" },
			{ key: "chat-group", label: "群聊" },
		],
	},
];
