import GetUser from "@/apis/user/get-user";
import { RepCode, ServerUrl } from "@/consts";
import useUserStore from "@/store/useUserStore";
import { UserInfo } from "@/types";
import { Button, Flex, Image, Tag, Upload, message } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import style from "./index.module.less";

function UserInfoComp() {
	const { username, setData, data, token } = useUserStore();
	const updateInfo = () =>
		GetUser({ user: username }).then((data) => {
			if (data.code == RepCode.Success) {
				setData(data.data as unknown as UserInfo);
			} else {
				message.error(data.msg);
			}
		});
	useEffect(() => {
		updateInfo();
	}, []); //eslint-disable-line
	return (
		<>
			<Flex gap="middle" vertical>
				<div>
					<Title level={5}>头像：</Title>
					<Flex style={{ alignItems: "center", gap: `5px` }}>
						<Image
							wrapperClassName={style.iconAvatarMask}
							className={style.iconAvatar}
							width={64}
							height={64}
							src={`${ServerUrl}${data.avatar?.slice(1)}`}
						/>
						<Upload
							headers={{ Authorization: `${token}` }}
							action={`${ServerUrl}/user/change-avatar`}
							onChange={() => updateInfo()}
							showUploadList={false}
						>
							<Button>修改头像</Button>
						</Upload>
					</Flex>
				</div>
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
