import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { DropdownProps, MenuProps } from 'antd';
import { Dropdown, Flex, Menu, Tag, Tooltip } from 'antd';
import classname from 'classnames';
import useUserStore from '@/store/useUserStore';
import { Outlet, useNavigate } from 'react-router';
import Lodding from '../Loading';
import { debounce } from 'radash';
import { GroupInfo, NonUndefined, UserFriend, UserGroup, UserInfo } from '@/types';
import SearchInput from './components/SearchInput';
import { ItemType } from 'antd/es/menu/interface';
import { SearchProps } from 'antd/es/input';
import ModalAddState from './components/ModalAddState';
import { MenuItem, items } from './consts/inex';
import withAuth from '@/hook/useWithAuth';
import { RepCode } from '@/consts';
import useUserChat from '@/store/useUserChat';
import classNames from 'classnames';
import GetFriend from '@/apis/user/get-friend';
import SearchUser from '@/apis/user/search-user';
import { DoubleRightOutlined, MenuFoldOutlined, SettingOutlined } from '@ant-design/icons';
import siderBus from '@/event-bus/sider-bus';
import { Content } from 'antd/es/layout/layout';
import GetJoinGroup from '@/apis/group/get-join-group';
import SearchGroup from '@/apis/group/search-group';
import ModalCreateGroup from './components/ModalCreateGroup';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
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
        () => Object.keys(SelectMenuItem ?? {}).length > 1, // 如果只是一个key的话，那么就是divider
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

    // 通过选择项判断是否选择的Group
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
                                    icon: <AvatarIcon url={val.avatar} />,
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
                                        icon: <AvatarIcon url={val.group_avatar} />,
                                    }) as ItemType,
                            ) as ItemType[];
                            allList = [...allList, ..._cache];
                        }
                    }
                    setDMenuOption((val) => {
                        val.items = allList;
                        return val;
                    });
                    allList.length > 0 && setIsOpenShow(true);
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
                        title: val.friend_data.nickname,
                        label: (
                            <Flex>
                                <Content
                                    className={`w-1/2 overflow-hidden text-ellipsis text-nowrap ${collapsed ? 'text-white' : ''}`}
                                >
                                    {val.friend_data.nickname}
                                </Content>
                                <Content>
                                    <Tag className="text-xs" color="green">
                                        好友
                                    </Tag>
                                </Content>
                            </Flex>
                        ),
                        icon: <AvatarIcon size="default" url={val.friend_data.avatar} />,
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
                            title: val.group_data.group_name,
                            label: (
                                <Flex>
                                    <Content
                                        className={`w-1/2 overflow-hidden text-ellipsis text-nowrap ${collapsed ? 'text-white' : ''}`}
                                    >
                                        {val.group_data.group_name}
                                    </Content>
                                    <Content>
                                        <Tag className="text-xs" color="blue">
                                            群组
                                        </Tag>
                                    </Content>
                                </Flex>
                            ),
                            icon: <AvatarIcon size="default" url={val.group_data.group_avatar} />,
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

    const openModalAddState = ({ key }: { key: string }) => {
        setSelectMenuItem({ title: key, key });
    };

    useEffect(() => {
        updateSider();
        siderBus.on('updateSider', () => updateSider());
        siderBus.on('openModalAddState', (e) => e && openModalAddState(e));
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
                                <DoubleRightOutlined
                                    className="select-none rounded p-2 transition-colors duration-200 hover:bg-gray-200"
                                    onClick={toggleCollapsed}
                                />
                            )}
                            {!collapsed && (
                                <MenuFoldOutlined
                                    className="select-none rounded p-2 transition-colors duration-200 hover:bg-gray-200"
                                    onClick={toggleCollapsed}
                                />
                            )}
                        </Flex>
                        {/* 用户信息 */}
                        <Flex className="w-full gap-2" align="center" vertical={collapsed}>
                            <AvatarIcon url={data.avatar} />
                            <Content className="overflow-hidden text-ellipsis text-nowrap text-center">
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
                    {/* 侧栏 */}
                    <Menu
                        style={{ height: '95%' }}
                        onClick={onClick}
                        mode="inline"
                        items={MenuList}
                        selectedKeys={[select]}
                        inlineCollapsed={collapsed}
                    />
                    {/* 底部设置 */}
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
            {/* Modal */}
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
