import { FC, useEffect, useState } from 'react';
import AddFriend from '@/apis/user/add-friend';
import GetUser from '@/apis/user/get-user';
import { RepCode } from '@/consts';
import siderBus from '@/event-bus/sider-bus';
import { GroupInfo, UserInfo } from '@/types';
import { Flex, Modal, ModalProps, Spin, Tag, message } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import Title from 'antd/es/typography/Title';
import GetGroup from '@/apis/group/get-group';
import JoinGroup from '@/apis/group/join-group';

interface _Prop {
    isGroup: boolean; // 是否是群组
    selectMenuItem: ItemType | undefined; // 选择的项目
    emitOpen: () => void; // 切换打开状态的方法
}
type NProp = _Prop & ModalProps;
const ModalAddState: FC<NProp> = (prop) => {
    const [stateInfo, setStateInfo] = useState<UserInfo | GroupInfo | undefined>();
    const [loadding, setLodding] = useState(false);
    const addState = () => {
        if (prop.isGroup) {
            JoinGroup({ group: prop.selectMenuItem!.key as string }).then((data) => {
                if (data.code == RepCode.Success) {
                    siderBus.emit('updateSider');
                    message.success(data.msg);
                    prop.emitOpen();
                } else {
                    message.error(data.msg);
                }
            });
        } else {
            AddFriend({ user: prop.selectMenuItem!.key as string }).then((data) => {
                if (data.code == RepCode.Success) {
                    siderBus.emit('updateSider');
                    message.success(data.msg);
                    prop.emitOpen();
                } else {
                    message.error(data.msg);
                }
            });
        }
    };
    useEffect(() => {
        if (prop.open) {
            setLodding(true);
            if (prop.isGroup) {
                GetGroup({ group: prop.selectMenuItem!.key as string }).then((data) => {
                    if (data.code == RepCode.Success) {
                        setStateInfo(data.data as unknown as GroupInfo);
                    }
                    setLodding(false);
                });
            } else {
                GetUser({ user: prop.selectMenuItem!.key as string }).then((data) => {
                    if (data.code == RepCode.Success) {
                        setStateInfo(data.data as unknown as UserInfo);
                    }
                    setLodding(false);
                });
            }
        }
    }, [prop.open]); //eslint-disable-line

    return (
        <>
            {!prop.isGroup && (
                <Modal
                    title={(stateInfo as UserInfo)?.nickname ?? ''}
                    {...prop}
                    okText="添加好友"
                    onOk={addState}
                    cancelText="取消"
                    onCancel={() => prop.emitOpen()}
                >
                    <Spin spinning={loadding}>
                        {(stateInfo as UserInfo) && (
                            <Flex gap="middle" vertical>
                                <div>
                                    <Title level={5}>昵称：</Title>
                                    {(stateInfo as UserInfo).nickname}
                                    {(stateInfo as UserInfo).group ? (
                                        <Tag
                                            bordered={false}
                                            style={{ background: '#f6ffed', color: '#52c41a' }}
                                        >
                                            管理员
                                        </Tag>
                                    ) : (
                                        <Tag>普通用户</Tag>
                                    )}
                                </div>
                                <div>
                                    <Title level={5}>用户名：</Title>
                                    {(stateInfo as UserInfo).username}
                                </div>
                                <div>
                                    <Title level={5}>电子邮箱：</Title>
                                    {(stateInfo as UserInfo).email}
                                </div>
                                <div>
                                    <Title level={5}>电话：</Title>
                                    {(stateInfo as UserInfo).phone}
                                </div>
                                <div>
                                    <Title level={5}>注册时间：</Title>
                                    {(stateInfo as UserInfo).register_time}
                                </div>
                            </Flex>
                        )}
                    </Spin>
                </Modal>
            )}
            {prop.isGroup && (
                <Modal
                    title={(stateInfo as GroupInfo)?.group_name ?? ''}
                    {...prop}
                    okText="加入群组"
                    cancelText="取消"
                    onOk={addState}
                    onCancel={() => prop.emitOpen()}
                >
                    <Spin spinning={loadding}>
                        {(stateInfo as GroupInfo) && (
                            <Flex gap="middle" vertical>
                                <div>
                                    <Title level={5}>群组名称：</Title>
                                    {(stateInfo as GroupInfo).group_name}
                                </div>
                                <div>
                                    <Title level={5}>群主：</Title>
                                    {(stateInfo as GroupInfo).group_master}
                                </div>
                                <div>
                                    <Title level={5}>简介：</Title>
                                    {(stateInfo as GroupInfo).group_desc}
                                </div>
                            </Flex>
                        )}
                    </Spin>
                </Modal>
            )}
        </>
    );
};
export default ModalAddState;
