import {
    Alert,
    Button,
    Col,
    Drawer,
    Dropdown,
    Flex,
    Image,
    Input,
    Popover,
    Row,
    Tag,
    Tooltip,
    Upload,
    UploadFile,
    UploadProps,
    message,
} from 'antd';
import ChatContainer from '@/components/ChatContainer/ChatContainer';
import useUserStore from '@/store/useUserStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AllowFileType, ServerUrl, WsCode, wsUrlGroup } from '@/consts';
import useSend from '@/hook/useSend';
import useServerStatus from '@/store/useServer';
import { useNavigate, useParams } from 'react-router-dom';
import { GroupInfo, GroupMember, WsData } from '@/types';
import ChatContext from '@/components/ChatContainer/utils/ChatContext';
import { LeftOutlined, MenuOutlined, PlusSquareOutlined, SendOutlined } from '@ant-design/icons';
import { FileType, getBase64 } from '@/utils';
import useUserChat from '@/store/useUserChat';
import siderBus from '@/event-bus/sider-bus';
import GetGroup from '@/apis/group/get-group';
import ExitGroup from '@/apis/group/exit-group';
import GetJoinGroup from '@/apis/group/get-join-group';
import GetGroupMembers from '@/apis/group/get-group-members';
import Title from 'antd/es/typography/Title';
import { Content } from 'antd/es/layout/layout';
import SetMemberAuth from '@/apis/group/set-member-auth';
import { ItemType } from 'antd/es/menu/interface';
import KickMember from '@/apis/group/kick-member';
import { GroupChatItemData } from '@/components/ChatContainer/type';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import style from './index.module.less';

interface PlusFilesProp {
    action: string;
    onChange: UploadProps['onChange'];
    beforeUpload: UploadProps['beforeUpload'];
    fileList: UploadProps['fileList'];
}
interface PreviewImageProp {
    FileObject: FileType;
}

function PreviewImage({ FileObject }: PreviewImageProp) {
    const [imageString, setImageString] = useState('');
    useEffect(() => {
        getBase64(FileObject).then((data) => {
            setImageString(data);
        });
    }, []); //eslint-disable-line
    return (
        <Image
            width={200}
            height={200}
            src={imageString}
            fallback="data:image/png;base64,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"
        />
    );
}

function PlusFiles({ action, onChange, beforeUpload, fileList }: PlusFilesProp) {
    return (
        <Upload
            action={action}
            onChange={onChange}
            fileList={fileList}
            beforeUpload={beforeUpload}
            showUploadList={false}
            multiple={false}
            maxCount={2}
        >
            <PlusSquareOutlined style={{ cursor: 'pointer' }} />
        </Upload>
    );
}

function ChatGroup() {
    const navigate = useNavigate();
    const params = useParams();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { username, token } = useUserStore();
    const { sendWrapper } = useSend();
    const { setStatus, status: Status } = useServerStatus();
    const { select, setSelect } = useUserChat();
    const [websocketInstance, setWS] = useState<WebSocket | null>();
    const [content, setContent] = useState('');
    const [drawerState, setDrawerState] = useState(false);
    const [list, setList] = useState<GroupChatItemData[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [currentMembers, setCurrentMembers] = useState<GroupMember[]>([]);
    const [currentGroup, setCurrentGroup] = useState(null as unknown as GroupInfo);

    const CurrentItems = (val: GroupMember) => {
        const contextMenus: ItemType[] = [];
        // 查找自己群组数据
        const SelfPeople = currentMembers.find((cMember) => cMember.user_id === username);
        if (SelfPeople && SelfPeople.auth > 0) {
            if (val.auth != 2)
                contextMenus.push({
                    key: 'set-manage',
                    label: !val.auth ? '设为管理员' : '降为成员',
                    onClick() {
                        const people = currentMembers.find(
                            (cMember) => cMember.user_id === val.user_id,
                        );
                        if (people) {
                            SetMemberAuth({
                                auth: val.auth ? 0 : 1,
                                group: currentGroup.group_id,
                                user: val.user_id,
                            }).then((data) => {
                                if (data.code) {
                                    message.success(data.msg);
                                    updateMembers();
                                } else {
                                    message.error(data.msg);
                                }
                            });
                        }
                    },
                });
            if (SelfPeople.auth == 2 && val.user_id != username)
                contextMenus.push({
                    key: 'kick-member',
                    label: '踢出成员',
                    onClick() {
                        KickMember({
                            group: currentGroup.group_id,
                            user: val.user_id,
                        }).then((data) => {
                            if (data.code) {
                                message.success(data.msg);
                                updateMembers();
                            } else {
                                message.error(data.msg);
                            }
                        });
                    },
                });
        }

        return contextMenus;
    };

    const handleExitClick = () => {
        const isMaster = currentGroup.group_master === username;
        if (isMaster) {
            // 删除群聊
            message.info('未开发！');
        } else {
            ExitGroup({ group: currentGroup.group_id }).then((data) => {
                if (data.code) {
                    message.success(data.msg);
                    navigate('/user', { replace: true });
                    siderBus.emit('updateSider');
                } else {
                    message.error(data.msg);
                }
            });
        }
    };

    const handleClick = () => {
        setDrawerState(!drawerState);
    };

    // 处理上传文件
    const handleChange: UploadProps['onChange'] = (info) => {
        let newFileList = [...info.fileList];
        if (newFileList.length <= 0) return;
        newFileList = newFileList.slice(-2);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.data[0];
            }
            return file;
        });
        setFileList(newFileList);
    };

    // 限制文件类型
    const beforeUpload = (file: UploadFile) => {
        const isAllow = AllowFileType.includes(file.type ?? '');
        if (!isAllow) {
            message.error(`${file.name.substring(file.name.lastIndexOf('.'))} 文件类型不支持`);
            return Upload.LIST_IGNORE;
        }

        return isAllow;
    };

    // 移除截图
    const handleRemoveImage = (index: number) => {
        const updatedList = [...fileList.slice(0, index), ...fileList.slice(index + 1)];
        setFileList(updatedList);
    };

    // 回车发送消息
    const handleSend = () => {
        if (websocketInstance instanceof WebSocket && content.length > 0) {
            if (websocketInstance.readyState) {
                websocketInstance.send(
                    sendWrapper({
                        type: WsCode.Send,
                        message: content,
                        data: {
                            files: fileList.map((val) => val.url),
                        },
                    }),
                );
                setContent('');
                setFileList([]);
            }
        }
    };

    //更新群成员列表
    const updateMembers = () =>
        GetGroupMembers({ group: params.group_id! }).then((data) => {
            if (data.code) {
                const members = data.data as unknown as GroupMember[];
                setCurrentMembers(members);
            }
        });

    // 发送消息滚动到底部
    const scrollbottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView();
        }
    };
    // 撤回消息
    const onWidthDraw = useCallback(
        (data: { target?: string; index: number }) => {
            {
                if (websocketInstance instanceof WebSocket && websocketInstance.readyState) {
                    websocketInstance.send(
                        sendWrapper({
                            type: WsCode.WithDraw,
                            message: '撤回',
                            data: {
                                group: data.target ? data.target : undefined,
                                index: data.index,
                            },
                        }),
                    );
                } else {
                    message.error('聊天异常，撤回失败！');
                }
            }
        },
        [sendWrapper, websocketInstance],
    );

    const ChatInject = useMemo(
        () => ({ onWidthDraw, group_id: params.group_id }),
        [onWidthDraw, params.group_id],
    );

    useEffect(() => {
        scrollbottom();
    }, [list]);

    useEffect(() => {
        if (drawerState) updateMembers();
    }, [drawerState]); //eslint-disable-line

    useEffect(() => {
        GetGroup({ group: select.substring(0, select.indexOf('/')) }).then((val) => {
            let info = null as unknown as GroupInfo;
            if (val.code) {
                info = val.data as unknown as GroupInfo;
                setCurrentGroup(info);
            } else {
                navigate('/user', { replace: true });
                siderBus.emit('updateSider');
                return;
            }
            // 在api中是因为 确保 currentGroup 有值
            // 是否加入了群聊
            GetJoinGroup({ user: username }).then((data) => {
                if (data.code) {
                    const group = data.data as GroupInfo[];
                    if (group.find((val) => val.group_id === info.group_id)) return;
                }
                navigate('/user', { replace: true });
                siderBus.emit('updateSider');
            });
        });
        let intervalNum: NodeJS.Timeout | number = -1;
        if (websocketInstance instanceof WebSocket) {
            websocketInstance.close();
        }
        const ws = new WebSocket(`${wsUrlGroup}?user=${username}&token=${token}`);
        setWS(ws);
        ws.onopen = () => {
            if (ws.readyState === 1) {
                // 启动心跳
                intervalNum = setInterval(() => {
                    if (ws.readyState !== 1) {
                        clearInterval(intervalNum);
                        message.error('聊天加载失败！');
                        ws.close();
                        return;
                    }
                    ws.send(
                        sendWrapper({
                            type: WsCode.HeartBeat,
                            message: 'HeartBeat',
                            data: username,
                        }),
                    );
                }, 2000);
                // 建立连接通道
                ws.send(
                    sendWrapper({
                        type: WsCode.CreateChannel,
                        message: 'CreateChannel',
                        data: {
                            group: params.group_id,
                        },
                    }),
                );
                message.success('连接通信正常！');
            } else {
                message.error('聊天加载失败！');
                setStatus(0);
            }
        };
        ws.onmessage = (e: MessageEvent) => {
            const data = JSON.parse(e.data) as WsData;
            switch (data.type) {
                case WsCode.HeartBeatServer:
                    // console.log("接收到服务器心跳：", data);
                    if (!Status) {
                        setStatus(1);
                    }
                    break;
                case WsCode.UpdateMsgList:
                    console.log('接收到服务器更新数据：', data);
                    setList(data.data);
                    break;
            }
        };
        ws.onerror = () => {
            message.error('聊天异常！');
            ws.close();
            setStatus(0);
        };
        ws.onclose = () => setStatus(0);
        scrollbottom();
        return () => {
            ws.close();
            clearInterval(intervalNum);
        };
    }, []); //eslint-disable-line

    return (
        <ChatContext.Provider value={ChatInject}>
            <Flex className={style.ChatBox} vertical onContextMenu={(e) => e.preventDefault()}>
                <Flex className={style.ChatHeader}>
                    <Flex>
                        <LeftOutlined
                            onClick={() => {
                                setSelect('');
                                navigate('/user', { replace: true });
                            }}
                            className="my-[25%] cursor-pointer select-none rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                        />
                    </Flex>
                    <Flex align="center" className={style.ChatHeaderNickName}>
                        <AvatarIcon url={currentGroup?.group_avatar} />
                        {currentGroup && currentGroup.group_name}
                    </Flex>
                    <Flex style={{ width: '100%' }} flex="1">
                        <span></span>
                    </Flex>
                    <Flex>
                        <MenuOutlined style={{ cursor: 'pointer' }} onClick={handleClick} />
                    </Flex>
                </Flex>
                <Flex flex={1} style={{ minHeight: '500px', height: '80%' }}>
                    <ChatContainer type="group" ref={containerRef} list={list} />
                </Flex>
                <Flex className={style.ChatBoxBottom}>
                    <Flex className={style.ChatBoxFiles}>
                        {fileList.map((val, index) => (
                            <Popover
                                key={val.uid}
                                content={
                                    <PreviewImage FileObject={val.originFileObj as FileType} />
                                }
                            >
                                <Alert
                                    style={{
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        padding: '4px 8px',
                                        margin: '4px',
                                    }}
                                    message={val.fileName ?? val.name}
                                    onClose={() => handleRemoveImage(index)}
                                    type="info"
                                />
                            </Popover>
                        ))}
                        <span
                            style={{
                                fontSize: '12px',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#ccc',
                            }}
                        >
                            最大支持上传2张图片（每张1MB），支持上传文件类型：
                            {AllowFileType.map((val) =>
                                val.substring(val.lastIndexOf('/') + 1),
                            ).join('、')}
                        </span>
                    </Flex>
                    <div className={style.ChatInputBox}>
                        <Input
                            value={content}
                            onInput={(e) => setContent((e.target as HTMLInputElement).value)}
                            onPressEnter={handleSend}
                            className={style.ChatInputWrapper}
                            placeholder="请输入要聊天的内容"
                        />
                        <Flex className={style.ChatInputBottom}>
                            <Flex className={style.ChatUploadButton}>
                                <PlusFiles
                                    action={`${ServerUrl}/user/upload-img`}
                                    onChange={handleChange}
                                    beforeUpload={beforeUpload}
                                    fileList={fileList}
                                />
                            </Flex>
                            <SendOutlined
                                onClick={handleSend}
                                className={style.ChatSendButton}
                                size={20}
                            />
                        </Flex>
                    </div>
                </Flex>
                {/* 侧栏 */}
                <Drawer
                    placement="right"
                    closable={false}
                    open={drawerState}
                    onClose={() => setDrawerState(false)}
                    getContainer={false}
                >
                    <Flex className="h-full w-full" gap={20} vertical>
                        <Flex gap={5}>
                            <AvatarIcon url={currentGroup.group_avatar}></AvatarIcon>
                            <Flex align="center">{currentGroup.group_name}</Flex>
                        </Flex>
                        <Flex gap={5} vertical>
                            <Title level={5}>群标识</Title>
                            <Content>{currentGroup.group_id}</Content>
                        </Flex>
                        <Flex gap={5} vertical>
                            <Title level={5}>简介</Title>
                            <Content>{currentGroup.group_desc}</Content>
                        </Flex>
                        <Flex vertical>
                            <Title level={5}>成员</Title>
                            <Row className="h-80 min-h-80 overflow-y-scroll">
                                {currentMembers.map((val) => (
                                    <Dropdown
                                        key={val.user_id}
                                        menu={{
                                            items: CurrentItems(val),
                                        }}
                                        trigger={['contextMenu']}
                                    >
                                        <Col span={6}>
                                            <Flex
                                                vertical
                                                className="cursor-pointer select-none rounded p-2 transition-colors hover:bg-gray-100"
                                                align="center"
                                            >
                                                <AvatarIcon url={val.user_data.avatar} />
                                                <Tooltip
                                                    title={val.user_data.nickname}
                                                    placement="bottom"
                                                >
                                                    <Content className="w-14 overflow-hidden text-ellipsis text-nowrap">
                                                        {val.user_data.nickname}
                                                    </Content>
                                                </Tooltip>
                                                <Content>
                                                    {/* 标识 */}
                                                    {val.auth == 2 && (
                                                        <Tag bordered={false} color="orange">
                                                            群主
                                                        </Tag>
                                                    )}
                                                    {val.auth == 1 && (
                                                        <Tag bordered={false} color="green">
                                                            管理
                                                        </Tag>
                                                    )}
                                                    {val.auth == 0 && (
                                                        <Tag bordered={false}>成员</Tag>
                                                    )}
                                                </Content>
                                            </Flex>
                                        </Col>
                                    </Dropdown>
                                ))}
                            </Row>
                            <Flex vertical>
                                <Button onClick={handleExitClick}>
                                    {(currentGroup?.group_master || '') === username
                                        ? '删除群组'
                                        : '退出群聊'}
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                </Drawer>
            </Flex>
        </ChatContext.Provider>
    );
}
export default ChatGroup;
