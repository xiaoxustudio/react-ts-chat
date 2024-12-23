import AddFriend from "@/apis/user/add-friend";
import GetUser from "@/apis/user/get-user";
import { RepCode } from "@/consts";
import { UserInfo } from "@/types";
import { Flex, message, Modal, ModalProps, Spin, Tag } from "antd";
import { ItemType } from "antd/es/menu/interface";
import Title from "antd/es/typography/Title";
import { FC, useEffect, useState } from "react";

interface _Prop {
	selectPeople: ItemType | undefined; // 选择的联系人
	emitOpen: () => void; // 切换打开状态的方法
}
type NProp = _Prop & ModalProps;
const ModalUser: FC<NProp> = (prop) => {
	const [userinfo, setUserInfo] = useState<UserInfo | undefined>();
	const [loadding, setLodding] = useState(false);
	const addFriend = () => {
		AddFriend({ user: prop.selectPeople!.key as string }).then((data) => {
			if (data.code == RepCode.Success) {
				message.success(data.msg);
				prop.emitOpen();
			} else {
				message.error(data.msg);
			}
		});
	};
	useEffect(() => {
		if (prop.open) {
			setLodding(true);
			GetUser({ user: prop.selectPeople!.key as string }).then((data) => {
				if (data.code == RepCode.Success) {
					setUserInfo(data.data as unknown as UserInfo);
				}
				setLodding(false);
			});
		}
	}, [prop.open]);
	return (
		<Modal
			title={userinfo?.nickname ?? ""}
			{...prop}
			okText="添加好友"
			onOk={addFriend}
			cancelText="取消"
			onCancel={() => prop.emitOpen()}
		>
			<Spin spinning={loadding}>
				{userinfo && (
					<Flex gap="middle" vertical>
						<div>
							<Title level={5}>昵称：</Title>
							{userinfo.nickname}
							{userinfo.group ? (
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
							{userinfo.username}
						</div>
						<div>
							<Title level={5}>电子邮箱：</Title>
							{userinfo.email}
						</div>
						<div>
							<Title level={5}>电话：</Title>
							{userinfo.phone}
						</div>
						<div>
							<Title level={5}>注册时间：</Title>
							{userinfo.register_time}
						</div>
					</Flex>
				)}
			</Spin>
		</Modal>
	);
};
export default ModalUser;
