import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { DropdownProps, MenuProps } from 'antd';
import { Avatar, Dropdown, Flex, Menu } from 'antd';
import classname from 'classnames';
import useUserStore from '@/store/useUserStore';
import { Outlet, useNavigate } from 'react-router';
import Lodding from '../Lodding';
import { debounce } from 'radash';
import { NonUndefined, UserFriend, UserInfo } from '@/types';
import SearchInput from './components/SearchInput';
import { ItemType } from 'antd/es/menu/interface';
import { SearchProps } from 'antd/es/input';
import ModalUser from './components/ModalUser';
import { MenuItem, items } from './consts/inex';
import withAuth from '@/hook/useWithAuth';
import { RepCode, ServerUrl } from '@/consts';
import useUserChat from '@/store/useUserChat';
import classNames from 'classnames';
import GetFriend from '@/apis/user/get-friend';
import SearchUser from '@/apis/user/search-user';
import styles from './user.module.less';
import { LeftOutlined, RightOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import siderBus from '@/event-bus/sider-bus';
import { Content } from 'antd/es/layout/layout';

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
    const [selectPeople, setSelectPeople] = useState<ItemType | undefined>(); // 当前选择的联系人
    const [isOpenShow, setIsOpenShow] = useState(false); // 是否可以显示下拉
    const [collapsed, setCollapsed] = useState(false); // 收缩菜单
    const style_Content = classname(styles['container-content']);
    const computedOpen = useMemo(() => Object.keys(selectPeople ?? {}).length > 1, [selectPeople]); // 是否显示Modal
    const [MenuList, setMenuList] = useState<MenuItem[]>([]);
    const DMenuOptionCK = (e: any) => {
        const _user = DMenuOption.items?.find((val) => val!.key == e.key);
        setIsOpenShow(false);
        setSelectPeople(_user);
    };
    const [DMenuOption, setDMenuOption] = useState<MenuProps>({
        items: [],
        onClick: DMenuOptionCK,
    });

    const settingItems: DropdownProps['menu'] = {
        items: [
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
                                        className="-ml-2 bg-white"
                                        size="small"
                                        icon={!val.avatar && <UserOutlined />}
                                        src={`${ServerUrl}${val.avatar?.slice(1)}`}
                                    />
                                ),
                            }) as ItemType,
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
                            className="bg-white"
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
                        <Content>
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
                        </Content>
                        <Flex
                            style={{ width: collapsed ? '40px' : '100%' }}
                            align="center"
                            vertical={collapsed}
                        >
                            <Avatar
                                className="w-8 min-w-8"
                                icon={!data.avatar && <UserOutlined />}
                                src={`${ServerUrl}${data.avatar?.slice(1)}`}
                            />
                            <Content>{collapsed ? nickname.substring(0, 2) : nickname}</Content>
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
                    <Flex style={{ padding: '5px' }}>
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
