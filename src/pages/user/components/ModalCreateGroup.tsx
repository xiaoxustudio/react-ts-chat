import { FC, useState } from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd';
import { Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';
import CreateGroup, { CreateGroupProp } from '@/apis/group/create-group';
import { ServerUrl } from '@/consts';
import { Upload } from 'antd';
import useUserStore from '@/store/useUserStore';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { message } from 'antd';
import siderBus from '@/event-bus/sider-bus';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';

const ModalCreateGroup: FC<ModalFuncProps> = (prop) => {
    const { token } = useUserStore();
    const [groupInfo, setGroupInfo] = useState<CreateGroupProp>({
        group_avatar: '',
        group_desc: '',
        group_name: '',
    });
    const updateInfo = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'done') {
            const url = info.file.response.data?.[0];
            setGroupInfo((v) => ({ ...v, group_avatar: url }));
        }
    };
    const onSubmit = () => {
        CreateGroup(groupInfo).then((data) => {
            if (data.code) {
                siderBus.emit('updateSider');
                prop.onCancel?.();
                message.success('创建群组成功！');
            } else {
                message.error(data.msg);
            }
        });
    };
    return (
        <Modal title="创建群组" okText="创建" cancelText="取消" {...prop} onOk={onSubmit}>
            <Flex className="gap-4" vertical>
                <Flex>
                    <Content>群聊头像</Content>
                    <Flex className="gap-5" align="center">
                        <AvatarIcon
                            className="rounded-full bg-gray-200"
                            url={groupInfo.group_avatar}
                        />
                        <Upload
                            headers={{ Authorization: `${token}` }}
                            action={`${ServerUrl}/group/upload-group-avatar`}
                            showUploadList={false}
                            onChange={updateInfo}
                            maxCount={1}
                        >
                            <Button>修改头像</Button>
                        </Upload>
                    </Flex>
                    <Content />
                </Flex>
                <Flex>
                    <Content>群聊名称</Content>
                    <Content>
                        <Input
                            placeholder="请输入群聊名称"
                            value={groupInfo.group_name}
                            onChange={(e) =>
                                setGroupInfo((v) => ({ ...v, group_name: e.target.value }))
                            }
                        />
                    </Content>
                </Flex>
                <Flex>
                    <Content>简介</Content>
                    <Content>
                        <TextArea
                            placeholder="请输入群聊简介！"
                            value={groupInfo.group_desc}
                            onChange={(e) =>
                                setGroupInfo((v) => ({ ...v, group_desc: e.target.value }))
                            }
                        />
                    </Content>
                </Flex>
            </Flex>
        </Modal>
    );
};
export default ModalCreateGroup;
