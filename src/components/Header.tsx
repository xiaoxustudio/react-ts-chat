import { Menu, MenuProps } from "antd";
import { Typography } from "antd";
import { useNavigate } from "react-router";
import useUserStore from "@/store/useUserStore";
import useHeaderStore from "@/store/useHeader";
type MenuItem = Required<MenuProps>["items"][number];
const { Text } = Typography;

function HeaderMenu() {
	const navigate = useNavigate();
	const { token, nickname, resetLogin } = useUserStore();
	const { select, setSelect } = useHeaderStore();
	const handleTurnLogin = !token
		? () => navigate("/login")
		: () => navigate("/user");
	const items: MenuItem[] = [
		{
			key: "Logo",
			extra: (
				<Text strong style={{ cursor: "pointer" }}>
					交交友
				</Text>
			),
		},
		{
			label: !token ? "未登录" : "用户：" + nickname,
			key: "user",
			onTitleClick: handleTurnLogin,
			children: token
				? [
						{
							key: "/user/user-info",
							label: "个人信息",
						},
						{
							key: "/login",
							label: "登出",
							onClick: () => {
								resetLogin();
							},
						},
				  ]
				: [],
		},
	];

	const onClick: MenuProps["onClick"] = (e) => {
		if (e.key !== "Logo") {
			setSelect(e.key);
			navigate(e.key);
		}
	};

	return (
		<>
			<Menu
				onClick={onClick}
				selectedKeys={[select]}
				mode="horizontal"
				items={items}
			/>
		</>
	);
}
export default HeaderMenu;
