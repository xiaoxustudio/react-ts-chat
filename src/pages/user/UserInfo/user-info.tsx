import GetUser from '@/apis/user/get-user';
import { RepCode, ServerUrl } from '@/consts';
import useUserStore from '@/store/useUserStore';
import { UserInfo } from '@/types';
import { Button, Flex, Tag, Upload, message, Input } from 'antd';
import { useEffect } from 'react';
import { Content } from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import useUserChat from '@/store/useUserChat';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import style from './index.module.less';

function UserInfoComp() {
    const navigate = useNavigate();
    const { setSelect } = useUserChat();
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
            <Flex className="h-full w-full items-center pt-5" gap="middle" vertical>
                <Flex className="w-full">
                    <LeftOutlined
                        className="mx-5 cursor-pointer select-none rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                        onClick={() => {
                            setSelect('');
                            navigate('/user', { replace: true });
                        }}
                    />
                </Flex>
                <Flex align="center">
                    <Content className="text-nowrap">头像：</Content>
                    <Flex style={{ alignItems: 'center', gap: `5px` }}>
                        <AvatarIcon className={style.iconAvatar} url={data.avatar} />
                        <Upload
                            headers={{ Authorization: `${token}` }}
                            action={`${ServerUrl}/user/change-avatar`}
                            onChange={() => updateInfo()}
                            showUploadList={false}
                        >
                            <Button>修改头像</Button>
                        </Upload>
                    </Flex>
                </Flex>
                <Flex className="gap-4">
                    <Content className="text-nowrap">昵称：</Content>
                    {data.nickname}
                    {data.group ? (
                        <Tag bordered={false} style={{ background: '#f6ffed', color: '#52c41a' }}>
                            管理员
                        </Tag>
                    ) : (
                        <Tag>普通用户</Tag>
                    )}
                </Flex>
                <Flex>
                    <Content className="text-nowrap">用户名：</Content>
                    {data.username}
                </Flex>
                <Flex>
                    <Content className="text-nowrap">电子邮箱：</Content>
                    <Input type="email" value={data.email ?? ''} readOnly />
                </Flex>
                <Flex>
                    <Content className="text-nowrap">电话：</Content>
                    <Input value={data.phone ?? ''} readOnly />
                </Flex>
                <Flex>
                    <Content className="text-nowrap">注册时间：</Content>
                    {data.register_time}
                </Flex>
            </Flex>
        </>
    );
}

export default UserInfoComp;
