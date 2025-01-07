import GetPageColls from '@/apis/doc/get-page-colls';
import RemoveColl from '@/apis/doc/rem-coll';
import SetAuthCollaborator from '@/apis/doc/set-auth-coll';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import { RepCode } from '@/consts';
import { CollsUser } from '@/types';
import { Button, Flex, List, message, Popconfirm, PopconfirmProps, Select, Tag } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

function Auth() {
    const navigate = useNavigate();
    const params = useParams();
    const [initLoading, setInitLoading] = useState(false);
    const [Colls, setColls] = useState<CollsUser[]>([]);
    const block = useMemo(() => params['block']!, [params]);

    const handleBack = () => navigate(-1);

    const confirm = (user_id: string) => {
        RemoveColl({ block, user: user_id }).then((data) => {
            if (data.code === RepCode.Success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
            update();
        });
    };

    const handleSelect = (user_id: string, auth: number) => {
        SetAuthCollaborator({ block, user: user_id, auth }).then((data) => {
            if (data.code === RepCode.Success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
        });
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
        message.error('Click on No');
    };

    const update = () => {
        setInitLoading(true);
        GetPageColls({ block }).then((data) => {
            if (data.code === RepCode.Success) {
                setColls(data.data as unknown as CollsUser[]);
            }
            setInitLoading(false);
        });
    };

    useEffect(() => {
        update();
    }, []); //eslint-disable-line
    return (
        <Flex className="h-full w-full" align="center" vertical>
            <Content className="w-full">
                <Button className="m-5" onClick={handleBack}>
                    返回
                </Button>
                <Button type="text">页面：{params['block']}</Button>
                <Content></Content>
                <Content></Content>
            </Content>
            <Content className="h-full w-5/6">
                <List
                    header={
                        <Flex justify="space-between">
                            <Content>
                                <strong>页面权限管理</strong>
                            </Content>
                            {/* <Flex justify="flex-end">
                                <Button type="link">邀请协作</Button>
                            </Flex> */}
                        </Flex>
                    }
                    className="h-full w-full"
                    loading={initLoading}
                    dataSource={Colls}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    title={false}
                                    description="是否要移除该用户"
                                    onConfirm={() => confirm(item.user_id)}
                                    onCancel={cancel}
                                    okText="移除"
                                    cancelText="取消"
                                    placement="left"
                                >
                                    <Button
                                        disabled={index == 0 && true}
                                        color="danger"
                                        variant="filled"
                                    >
                                        移除
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<AvatarIcon url={item.user_data.avatar} />}
                                title={
                                    index == 0 ? (
                                        <Flex gap={5}>
                                            {item.user_id}
                                            <Tag color="green">创建者</Tag>
                                        </Flex>
                                    ) : (
                                        item.user_id
                                    )
                                }
                                description={item.user_data.nickname}
                            />
                            <div>
                                权限：
                                <Select
                                    disabled={index == 0 && true}
                                    defaultValue={item.auth}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 2, label: '可管理' },
                                        { value: 1, label: '可编辑' },
                                        { value: 0, label: '可查看' },
                                    ]}
                                    onChange={(auth: number) => handleSelect(item.user_id, auth)}
                                />
                            </div>
                        </List.Item>
                    )}
                />
            </Content>
            <Content></Content>
        </Flex>
    );
}

export default Auth;
