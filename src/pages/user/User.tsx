import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { DropdownProps, MenuProps } from 'antd';
import { Avatar, Dropdown, Flex, Menu, Tag, Tooltip } from 'antd';
import classname from 'classnames';
import useUserStore from '@/store/useUserStore';
import { Outlet, useNavigate } from 'react-router';
import Lodding from '../Lodding';
import { debounce } from 'radash';
import { GroupInfo, NonUndefined, UserFriend, UserGroup, UserInfo } from '@/types';
import SearchInput from './components/SearchInput';
import { ItemType } from 'antd/es/menu/interface';
import { SearchProps } from 'antd/es/input';
import ModalAddState from './components/ModalAddState';
import { MenuItem, items } from './consts/inex';
import withAuth from '@/hook/useWithAuth';
import { RepCode, ServerUrl } from '@/consts';
import useUserChat from '@/store/useUserChat';
import classNames from 'classnames';
import GetFriend from '@/apis/user/get-friend';
import SearchUser from '@/apis/user/search-user';
import { LeftOutlined, RightOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import siderBus from '@/event-bus/sider-bus';
import { Content } from 'antd/es/layout/layout';
import GetJoinGroup from '@/apis/group/get-join-group';
import SearchGroup from '@/apis/group/search-group';
import ModalCreateGroup from './components/ModalCreateGroup';
import styles from './user.module.less';

interface MenuInfo {
    key: string;
    domEvent: SyntheticEvent;
    keyPath: string[];
}

type OnSearchType = NonUndefined<SearchProps['onChange']>;
const User: React.FC = withAuth(() => {
    const navigate = useNavigate();
    const { resetLogin } = useUserStore();
    const { nickname, username, data } = useUserStore();
    const { select, setSelect } = useUserChat();
    const [SelectMenuItem, setSelectMenuItem] = useState<ItemType | undefined>(); // 当前选择的联系人
    const [isOpenShow, setIsOpenShow] = useState(false); // 是否可以显示下拉
    const [collapsed, setCollapsed] = useState(false); // 收缩菜单
    const style_Content = classname(styles['container-content']);
    const computedOpen = useMemo(
        () => Object.keys(SelectMenuItem ?? {}).length > 1,
        [SelectMenuItem],
    ); // 是否显示Modal
    const [groupModal, setGroupModal] = useState(false);
    const [MenuList, setMenuList] = useState<MenuItem[]>([]);
    const DMenuOptionCK = (e: any) => {
        const _user = DMenuOption.items?.find((val) => val!.key == e.key);
        setIsOpenShow(false);
        setSelectMenuItem(_user);
    };
    const [DMenuOption, setDMenuOption] = useState<MenuProps>({
        items: [],
        onClick: DMenuOptionCK,
    });
    const is_Group = useMemo(() => {
        if (!DMenuOption.items) return false;
        const div_index = DMenuOption.items.findIndex((val) => val?.type === 'divider');
        const key_index = DMenuOption.items.findIndex(
            (val) => val!.key === (SelectMenuItem?.key ?? ''),
        );
        return key_index > div_index;
    }, [DMenuOption.items, SelectMenuItem?.key]);

    const settingItems: DropdownProps['menu'] = {
        items: [
            {
                key: 'create-group',
                label: '创建群组',
                onClick: () => setGroupModal(!groupModal),
            },
            {
                key: 'user-info',
                label: '个人信息',
                onClick: () => {
                    navigate('/user/user-info');
                },
            },
            {
                key: 'login',
                label: '登出',
                onClick: () => {
                    resetLogin();
                    navigate('/login', { replace: true });
                },
            },
        ],
    };

    // 搜索
    const getSearch = debounce<Parameters<OnSearchType>>({ delay: 800 }, (e) => {
        setIsOpenShow(false);
        const nickname = e.target.value ?? '';
        if (nickname.length <= 0) {
            return;
        }
        let allList: ItemType[] = [];
        SearchUser({ nickname })
            .then((data) => {
                if (data.code == RepCode.Success) {
                    const op = data.data as UserInfo[];
                    if (Array.isArray(op) && op.length > 0) {
                        const _cache = op.map(
                            (val) =>
                                ({
                                    key: val.username,
                                    label: (
                                        <Flex>
                                            <Content className="w-full overflow-hidden text-ellipsis text-nowrap">
                                                {val.nickname}
                                            </Content>
                                        </Flex>
                                    ),
                                    icon: (
                                        <Avatar
                                            className="-ml-2 bg-white"
                                            size="small"
                                            icon={!val.avatar && <UserOutlined />}
                                            src={`${ServerUrl}${val.avatar?.slice(1)}`}
                                        />
                                    ),
                                }) as ItemType,
                        ) as ItemType[];
                        allList = _cache;
                    }
                    allList.push({
                        key: Math.random().toString(32).slice(2, 12).padEnd(9, '0'),
                        type: 'divider',
                    });
                }
            })
            .then(() => {
                SearchGroup({ group: nickname }).then((data) => {
                    if (data.code == RepCode.Success) {
                        const op = data.data as GroupInfo[];
                        if (Array.isArray(op) && op.length > 0) {
                            const _cache = op.map(
                                (val) =>
                                    ({
                                        key: val.group_id,
                                        label: (
                                            <Flex className="w-1/2 gap-2 overflow-hidden text-ellipsis text-nowrap">
                                                {val.group_name}
                                                <Tag className="text-xs" color="blue">
                                                    群组
                                                </Tag>
                                            </Flex>
                                        ),
                                        icon: (
                                            <Avatar
                                                className="-ml-2 bg-white"
                                                size="small"
                                                icon={!val.group_avatar && <UserOutlined />}
                                                src={`${ServerUrl}${val.group_avatar?.slice(1)}`}
                                            />
                                        ),
                                    }) as ItemType,
                            ) as ItemType[];
                            allList = [...allList, ..._cache];
                        }
                    }
                    setDMenuOption((val) => {
                        val.items = allList;
                        return val;
                    });
                    allList.length > 1 && setIsOpenShow(true);
                });
            });
    });
    // 切换Modal方法
    const emitOpen = () => setSelectMenuItem(undefined);
    // 左侧菜单路由跳转
    const onClick = useCallback((e: MenuInfo) => {
        navigate(`/user/${e.key}`);
        setSelect(e.key);
    }, []); //eslint-disable-line
    const updateFriends = () => {
        let allList: ItemType[] = [];
        GetFriend({ user: username })
            .then((data) => {
                if (data.code == RepCode.Success) {
                    const fdata = data.data as UserFriend[];
                    const pFdata = fdata.map((val) => ({
                        key: `${val.friend_id}/chat`,
                        label: (
                            <Flex>
                                <Tooltip title={val.friend_data.nickname} placement="right">
                                    <Content className="w-1/2 overflow-hidden text-ellipsis text-nowrap">
                                        {val.friend_data.nickname}
                                    </Content>
                                </Tooltip>
                                <Content>
                                    <Tag className="text-xs" color="green">
                                        好友
                                    </Tag>
                                </Content>
                            </Flex>
                        ),
                        icon: (
                            <Avatar
                                className="bg-white"
                                icon={!val.friend_data.avatar && <UserOutlined />}
                                src={`${ServerUrl}${val.friend_data.avatar?.slice(1)}`}
                            />
                        ),
                    }));
                    allList = allList.concat(pFdata);
                }
            })
            .then(() =>
                GetJoinGroup({ user: username }).then((data) => {
                    if (data.code == RepCode.Success) {
                        const fdata = data.data as UserGroup[];
                        const pFdata = fdata.map((val) => ({
                            key: `${val.group_id}/group`,
                            label: (
                                <Flex>
                                    <Tooltip title={val.group_data.group_name} placement="right">
                                        <Content className="w-1/2 overflow-hidden text-ellipsis text-nowrap">
                                            {val.group_data.group_name}
                                        </Content>
                                    </Tooltip>
                                    <Content>
                                        <Tag className="text-xs" color="blue">
                                            群组
                                        </Tag>
                                    </Content>
                                </Flex>
                            ),
                            icon: (
                                <Avatar
                                    className="bg-white"
                                    icon={!val.group_data.group_avatar && <UserOutlined />}
                                    src={`${ServerUrl}${val.group_data.group_avatar?.slice(1)}`}
                                />
                            ),
                        }));
                        allList = allList.concat(pFdata);
                    }
                    setMenuList(allList);
                }),
            );
    };
    const onOKHandle = () => {
        setSelectMenuItem(undefined);
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
        siderBus.on('updateSider', () => updateSider());
    }, []); //eslint-disable-line

    return (
        <>
            <Flex className={styles['container-flex']}>
                {/* 左侧 */}
                <Flex
                    className={classNames(styles['container-side'], {
                        [styles['collapsed-layer']]: collapsed,
                    })}
                    vertical
                >
                    <Flex
                        className="gap-5 p-2"
                        style={{
                            width: collapsed ? '80px' : '100%',
                            borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)',
                        }}
                        vertical
                    >
                        <Flex className={collapsed ? 'w-full justify-center' : ''} align="center">
                            {collapsed && (
                                <RightOutlined
                                    className="select-none rounded p-2 transition-colors duration-200 hover:bg-gray-200"
                                    onClick={toggleCollapsed}
                                />
                            )}
                            {!collapsed && (
                                <LeftOutlined
                                    className="select-none rounded p-2 transition-colors duration-200 hover:bg-gray-200"
                                    onClick={toggleCollapsed}
                                />
                            )}
                        </Flex>
                        <Flex className="w-full gap-2" align="center" vertical={collapsed}>
                            <Avatar
                                className="w-8 min-w-8"
                                icon={!data.avatar && <UserOutlined />}
                                src={`${ServerUrl}${data.avatar?.slice(1)}`}
                            />
                            <Content className="text-center">
                                {collapsed ? (
                                    <Tooltip title={nickname} placement="right">
                                        {nickname.substring(0, 2)}
                                    </Tooltip>
                                ) : (
                                    nickname
                                )}
                            </Content>
                        </Flex>
                    </Flex>
                    <Menu
                        style={{ height: '95%' }}
                        onClick={onClick}
                        mode="inline"
                        items={MenuList}
                        defaultSelectedKeys={[select]}
                        inlineCollapsed={collapsed}
                    />
                    <Flex style={{ padding: '5px 0 20px 0' }}>
                        <Flex>{''}</Flex>
                        <Flex>{''}</Flex>
                        <Flex className="w-full select-none items-center justify-center">
                            <Dropdown menu={settingItems} trigger={['click']}>
                                <SettingOutlined className="cursor-pointer shadow-sm" size={64} />
                            </Dropdown>
                        </Flex>
                    </Flex>
                </Flex>
                {/* 右侧 */}
                <div style={{ width: '100%', height: '100%' }}>
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
            <ModalAddState
                open={computedOpen}
                selectMenuItem={SelectMenuItem}
                onOk={onOKHandle}
                emitOpen={emitOpen}
                isGroup={is_Group}
            />
            <ModalCreateGroup open={groupModal} onCancel={() => setGroupModal(false)} />
        </>
    );
});

export default User;
