import GetUser from '@/apis/user/get-user';
import { RepCode, ServerUrl } from '@/consts';
import useUserStore from '@/store/useUserStore';
import { UserInfo } from '@/types';
import {
    Button,
    Flex,
    Tag,
    Upload,
    message,
    Input,
    Popconfirm,
    Form,
    FormProps,
    Spin,
    Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import useUserChat from '@/store/useUserChat';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import ValidEmail from '@/apis/user/valid-email';
import style from './index.module.less';
import SendEmail from '@/apis/user/send-code';

interface CodeFormType {
    tokenCode: string;
}

function UserInfoComp() {
    const navigate = useNavigate();
    const { setSelect } = useUserChat();
    const { username, setData: setStoreData, data: StoreData, token } = useUserStore();
    const [data, setData] = useState<UserInfo>(StoreData as unknown as UserInfo);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [from] = Form.useForm<CodeFormType>();
    const [loading, setLoading] = useState(false);
    const updateInfo = () => {
        setLoading(true);
        GetUser({ user: username }).then((data) => {
            if (data.code == RepCode.Success) {
                setData(data.data as unknown as UserInfo);
            } else {
                message.error(data.msg);
            }
            setLoading(false);
        });
    };
    const handleSendEmail = () =>
        data.email &&
        SendEmail({ email: data.email }).then((data) => {
            if (data.code == RepCode.Success) {
                message.success(data.msg);
                setTimeout(() => updateInfo(), 1);
            } else {
                message.error(data.msg);
            }
        });
    const handleFinish: FormProps['onFinish'] = (values: CodeFormType) => {
        setConfirmLoading(true);
        ValidEmail({ user: username, code: values.tokenCode }).then((data) => {
            if (data.code == RepCode.Success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
            setConfirmLoading(false);
            from.resetFields();
        });
    };
    useEffect(() => {
        updateInfo();
        return () => {
            setStoreData(data as unknown as UserInfo);
        };
    }, []); //eslint-disable-line
    return (
        <Spin wrapperClassName="h-full w-full items-center pt-5" spinning={loading}>
            <Flex className="w-full">
                <LeftOutlined
                    className="mx-5 cursor-pointer select-none rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => {
                        setSelect('');
                        navigate('/user', { replace: true });
                    }}
                />
            </Flex>
            {data && (
                <Flex className="m-auto h-full w-1/2 justify-center pt-5" gap="middle" vertical>
                    <Flex align="center">
                        <Space className="text-nowrap">头像：</Space>
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
                        <Space className="text-nowrap">昵称：</Space>
                        {data.nickname}
                        {data.group ? (
                            <Tag
                                bordered={false}
                                style={{ background: '#f6ffed', color: '#52c41a' }}
                            >
                                管理员
                            </Tag>
                        ) : (
                            <Tag>普通用户</Tag>
                        )}
                    </Flex>
                    <Flex>
                        <Space className="text-nowrap">用户名：</Space>
                        {data.username}
                    </Flex>
                    <Flex>
                        <Space className="text-nowrap">电子邮箱：</Space>
                        <Input type="email" value={data.email ?? ''} readOnly />
                        <span className="ml-2">
                            {data.email_auth ? (
                                <Tag color="green">已验证</Tag>
                            ) : (
                                <Popconfirm
                                    description={
                                        <Flex>
                                            <Form<CodeFormType>
                                                onFinish={handleFinish}
                                                form={from}
                                                initialValues={{ tokenCode: '' }}
                                            >
                                                <Form.Item<CodeFormType>
                                                    label="验证码"
                                                    name="tokenCode"
                                                >
                                                    <Flex align="center">
                                                        <Input.OTP
                                                            size="small"
                                                            length={6}
                                                            variant="filled"
                                                        />
                                                        <Button
                                                            className="ml-2 text-xs"
                                                            size="small"
                                                            type="text"
                                                            onClick={handleSendEmail}
                                                        >
                                                            发送验证码
                                                        </Button>
                                                    </Flex>
                                                </Form.Item>
                                            </Form>
                                        </Flex>
                                    }
                                    trigger={'click'}
                                    okText="验证"
                                    onConfirm={() => from.submit()}
                                    showCancel={false}
                                    icon={null}
                                    title={null}
                                >
                                    <Tag className="cursor-pointer select-none" color="red">
                                        未验证
                                        {confirmLoading && (
                                            <Spin
                                                indicator={
                                                    <LoadingOutlined
                                                        className="text-red-500"
                                                        spin
                                                    />
                                                }
                                                size="small"
                                            />
                                        )}
                                    </Tag>
                                </Popconfirm>
                            )}
                        </span>
                    </Flex>
                    <Flex>
                        <Space className="text-nowrap">电话：</Space>
                        <Input value={data.phone ? data.phone : ''} readOnly />
                    </Flex>
                    <Flex>
                        <Space className="text-nowrap">注册时间：</Space>
                        {data.register_time}
                    </Flex>
                </Flex>
            )}
        </Spin>
    );
}

export default UserInfoComp;
