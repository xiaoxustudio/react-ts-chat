import { Post } from "@/alova";
import { RepCode } from "@/consts";
import useUserStore from "@/store/useUserStore";
import { UserInfo } from "@/types";
import { Flex, message, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";

function UserInfoComp() {
	const { username, setData, data } = useUserStore();
	useEffect(() => {
		Post("/api/user/get-user", { user: username }).then((data) => {
			if (data.code == RepCode.Success) {
				message.success(data.msg);
				setData(data.data as unknown as UserInfo);
			} else {
				message.error(data.msg);
			}
		});
	}, []);
	return (
		<>
			<Flex gap="middle" vertical>
				<div>
					<Title level={5}>昵称：</Title>
					{data.nickname}
					{data.group ? (
						<Tag
							bordered={false}
							style={{ background: "#f6ffed", color: "#52c41a" }}
						>
							管理员
						</Tag>
					) : (
						<Tag>普通用户</Tag>
					)}
				</div>
				<div>
					<Title level={5}>用户名：</Title>
					{data.username}
				</div>
				<div>
					<Title level={5}>电子邮箱：</Title>
					{data.email}
				</div>
				<div>
					<Title level={5}>电话：</Title>
					{data.phone}
				</div>
				<div>
					<Title level={5}>注册时间：</Title>
					{data.register_time}
				</div>
			</Flex>
		</>
	);
}

export default UserInfoComp;
