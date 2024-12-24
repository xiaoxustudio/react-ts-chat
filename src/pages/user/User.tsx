import React, {
	SyntheticEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { BreadcrumbProps, MenuProps } from "antd";
import { Avatar, Breadcrumb, Button, Flex, Menu } from "antd";
import classname from "classnames";
import Title from "antd/es/typography/Title";
import useUserStore from "@/store/useUserStore";
import { Outlet, useNavigate } from "react-router";
import Lodding from "../Lodding";
import { debounce } from "radash";
import { NonUndefined, UserFriend, UserInfo } from "@/types";
import SearchInput from "./components/SearchInput";
import { ItemType } from "antd/es/menu/interface";
import { SearchProps } from "antd/es/input";
import ModalUser from "./components/ModalUser";
import { items, MenuItem } from "./consts/inex";
import withAuth from "@/hook/useWithAuth";
import { RepCode, ServerUrl } from "@/consts";
import useUserChat from "@/store/useUserChat";
import classNames from "classnames";
import GetFriend from "@/apis/user/get-friend";
import SearchUser from "@/apis/user/search-user";
import styles from "./user.module.less";
import { UserOutlined } from "@ant-design/icons";
import siderBus from "@/event-bus/sider-bus";

interface MenuInfo {
	key: string;
	domEvent: SyntheticEvent;
	keyPath: string[];
}

type OnSearchType = NonUndefined<SearchProps["onChange"]>;
const User: React.FC = withAuth(() => {
	const navigate = useNavigate();
	const { nickname, username } = useUserStore();
	const { select, setSelect } = useUserChat();
	const [selectPeople, setSelectPeople] = useState<ItemType | undefined>(); // 当前选择的联系人
	const [isOpenShow, setIsOpenShow] = useState(false); // 是否可以显示下拉
	const [collapsed, setCollapsed] = useState(false); // 收缩菜单
	const style_Content = classname(styles["container-content"]);
	const computedOpen = useMemo(
		() => Object.keys(selectPeople ?? {}).length > 1,
		[selectPeople]
	); // 是否显示Modal
	const [MenuList, setMenuList] = useState<MenuItem[]>([]);
	const [bc] = useState<BreadcrumbProps["items"]>([]);
	const DMenuOptionCK = (e: any) => {
		const _user = DMenuOption.items?.find((val) => val!.key == e.key);
		setIsOpenShow(false);
		setSelectPeople(_user);
	};
	const [DMenuOption, setDMenuOption] = useState<MenuProps>({
		items: [],
		onClick: DMenuOptionCK,
	});
	// 搜索
	const getSearch = debounce<Parameters<OnSearchType>>({ delay: 800 }, (e) => {
		setIsOpenShow(false);
		const nickname = e.target.value ?? "";
		if (nickname.length < 2) {
			return;
		}
		SearchUser({ nickname }).then((data) => {
			if (data.code == RepCode.Success) {
				const op = data.data as UserInfo[];
				if (Array.isArray(op) && op.length > 0) {
					const _cache = op.map(
						(val) =>
							({
								key: val.username,
								label: val.nickname,
								icon: (
									<Avatar
										style={{ color: "white" }}
										size="small"
										icon={!val.avatar && <UserOutlined />}
										src={`${ServerUrl}${val.avatar?.slice(1)}`}
									/>
								),
							} as ItemType)
					) as ItemType[];
					setDMenuOption((val) => {
						val.items = _cache;
						return val;
					});
					setIsOpenShow(true);
				}
			}
		});
	});
	// 切换Modal方法
	const emitOpen = () => setSelectPeople(undefined);
	// 左侧菜单路由跳转
	const onClick = useCallback((e: MenuInfo) => {
		navigate(`/user/${e.key}`);
		setSelect(e.key);
	}, []); //eslint-disable-line
	const updateFriends = () => {
		GetFriend({ user: username }).then((data) => {
			if (data.code == RepCode.Success) {
				const fdata = data.data as UserFriend[];
				const pFdata = fdata.map((val) => ({
					key: `${val.friend_id}/chat`,
					label: val.friend_data.nickname,
					icon: (
						<Avatar
							style={{ color: "white" }}
							size="small"
							icon={!val.friend_data.avatar && <UserOutlined />}
							src={`${ServerUrl}${val.friend_data.avatar?.slice(1)}`}
						/>
					),
				}));
				setMenuList(pFdata);
			}
		});
	};
	const onOKHandle = () => {
		setSelectPeople(undefined);
	};
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	const updateSider = () => {
		setMenuList(items);
		updateFriends();
	};

	useEffect(() => {
		updateSider();
		siderBus.on("updateSider", () => updateSider());
	}, []); //eslint-disable-line
	return (
		<>
			<Flex className={styles["container-flex"]}>
				{/* 左侧 */}
				<div className={classNames(styles["container-side"])}>
					<div
						style={{
							width: collapsed ? "80px" : "100%",
							padding: "2px 10px",
							borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)",
						}}
					>
						<Title level={5} style={{ width: collapsed ? "40px" : "100%" }}>
							{collapsed ? nickname.substring(0, 1) : nickname}
							<Button onClick={toggleCollapsed} />
						</Title>
						<Breadcrumb items={bc} />
					</div>
					<Menu
						style={{ height: "95%" }}
						onClick={onClick}
						mode="inline"
						items={MenuList}
						defaultSelectedKeys={[select]}
						inlineCollapsed={collapsed}
					/>
				</div>
				{/* 右侧 */}
				<div style={{ width: "100%", height: "100%" }}>
					<SearchInput
						open={isOpenShow}
						options={DMenuOption}
						placeholder="请输入要搜索的联系人名称"
						onChange={getSearch}
					/>
					<div className={style_Content}>
						<Lodding children={<Outlet />}></Lodding>
					</div>
				</div>
			</Flex>
			<ModalUser
				open={computedOpen}
				selectPeople={selectPeople}
				onOk={onOKHandle}
				emitOpen={emitOpen}
			/>
		</>
	);
});

export default User;
