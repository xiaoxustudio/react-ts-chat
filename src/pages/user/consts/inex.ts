import { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>["items"][number];

export const items: MenuItem[] = [
	{
		type: "divider",
	},
	{
		key: "group",
		label: "",
		type: "group",
		children: [],
	},
];
