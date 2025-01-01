import { WsCode } from '@/consts';
import { MenuProps } from 'antd';
import { InputProps } from 'antd/es/input';
import { DataNode } from 'antd/es/tree';
// 去除undefined
export type NonUndefined<T> = T extends undefined ? never : T;

export interface RepsonseData {
    code: number;
    msg: string;
    data: object[];
}

// 登录data
export interface LoginData extends Omit<RepsonseData, 'data'> {
    data: {
        token: string;
        nickname: string;
        username: string;
    };
}

// 用户信息
export interface UserInfo {
    email: string;
    email_auth: number;
    group: number;
    login_time: string;
    nickname: string;
    phone: string | null;
    register_time: string;
    username: string;
    avatar: string;
}

// 好友
export interface UserFriend {
    add_time: string;
    friend_id: number;
    id: string;
    user_id: string;
    friend_data: UserInfo;
}

// 群组
export interface GroupInfo {
    id: number;
    group_id: string;
    group_status: number;
    group_name: string;
    group_desc: string;
    group_avatar: string;
    group_master: string;
}

// 用户群组（查询群组数据
export interface UserGroup {
    id: string;
    user_id: string;
    group_id: string;
    add_time: string;
    auth: number;
    group_data: GroupInfo;
}

// 群组成员（查询成员数据
export interface GroupMember {
    id: string;
    user_id: string;
    group_id: string;
    add_time: string;
    auth: number;
    user_data: UserInfo;
}

interface _SearchInputProps {
    options?: MenuProps;
    open: boolean;
}

export interface WsData {
    type: WsCode;
    message: string | ArrayBufferLike;
    data?: any;
}

export interface IDoc {
    id: string; // ID
    blcok: string; // blockID
    user_id: string; // 属于用户
    type: string; // 类型 0 文件夹 1 页面
    content: string; // 页面内容
    status: string; // block状态 0 锁定 1 可编辑
}

export interface IDoc {
    id: string; // ID
    blcok: string; // blockID
    user_id: string; // 属于用户
    type: string; // 类型 0 文件夹 1 页面
    content: string; // 页面内容
    status: string; // block状态 0 锁定 1 可编辑
}
export interface DocItem {
    id: number; // ID
    block: string; // blockID
    block_desc: string; // 页面简介
    block_name: string; // 页面名称
    user_id: string; // 属于用户
    type: number; // 类型 0 文件夹 1 页面
    content: string; // 页面内容
    status: number; // block状态 0 锁定 1 可编辑
}

export interface DocItemData extends Partial<DocItem>, DataNode {
    chilren: DocItemData[];
}

export type SearchInputProps = _SearchInputProps & InputProps;
