import { WsCode } from '@/consts';
import { MenuProps } from 'antd';
import { InputProps } from 'antd/es/input';
// 去除undefined
export type NonUndefined<T> = T extends undefined ? never : T;
export interface RepsonseData {
    code: number;
    msg: string;
    data: object[];
}
export interface LoginData extends Omit<RepsonseData, 'data'> {
    data: {
        token: string;
        nickname: string;
        username: string;
    };
}

export interface UserInfo {
    email: string;
    group: number;
    login_time: string;
    nickname: string;
    phone: string | null;
    register_time: string;
    username: string;
    avatar: string;
}
export interface UserFriend {
    add_time: string;
    friend_id: number;
    id: string;
    user_id: string;
    friend_data: UserInfo;
}

export interface Group {
    id: number;
    group_id: string;
    group_status: number;
    group_name: string;
    group_desc: string;
    group_avatar: string;
    group_master: string;
}

export interface UserGroup {
    id: string;
    user_id: string;
    group_id: string;
    add_time: string;
    auth: number;
    group_data: Group;
}

interface _SearchInputProps {
    options?: MenuProps;
    open: boolean;
}

export interface WsData {
    type: WsCode;
    message: string;
    data?: any;
}
export type SearchInputProps = _SearchInputProps & InputProps;
