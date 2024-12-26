import {
    Alert,
    Avatar,
    Dropdown,
    Flex,
    Image,
    Input,
    MenuProps,
    Popover,
    Upload,
    UploadFile,
    UploadProps,
    message,
} from 'antd';
import ChatContainer from '@/components/ChatContainer/ChatContainer';
import useUserStore from '@/store/useUserStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AllowFileType, ServerUrl, WsCode, wsUrl, wsUrlGroup } from '@/consts';
import useSend from '@/hook/useSend';
import useServerStatus from '@/store/useServer';
import { useNavigate, useParams } from 'react-router-dom';
import { GroupInfo, WsData } from '@/types';
import ChatContext from '@/components/ChatContainer/utils/ChatContext';
import { MenuOutlined, PlusSquareOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { FileType, getBase64 } from '@/utils';
import style from './index.module.less';
import useUserChat from '@/store/useUserChat';
import GetUser from '@/apis/user/get-user';
import DelFriend from '@/apis/user/del-friend';
import siderBus from '@/event-bus/sider-bus';
import GetGroup from '@/apis/group/get-group';
import ExitGroup from '@/apis/group/exit-group';
import GetJoinGroup from '@/apis/group/get-join-group';

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
    const { select } = useUserChat();
    const [websocketInstance, setWS] = useState<WebSocket | null>();
    const [content, setContent] = useState('');
    const [list, setList] = useState<any[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [currentGroup, setCurrentGroup] = useState(null as unknown as GroupInfo);
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (currentGroup?.group_master || '') === username ? '删除群组' : '退出群聊',
            onClick() {
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
            },
        },
    ];

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

    useEffect(() => {
        scrollbottom();
    }, [list]);

    const ChatInject = useMemo(
        () => ({ onWidthDraw, group_id: params.group_id }),
        [onWidthDraw, params.group_id],
    );

    useEffect(() => {
        // 是否加入了群聊
        GetJoinGroup({ user: username }).then((data) => {
            if (data.code) {
                const group = data.data as GroupInfo[];
                if (group.find((val) => val.group_id === currentGroup.group_id)) return;
            }
            navigate('/user', { replace: true });
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
                        setStatus(0);
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
                }, 1000);
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
                    !Status && setStatus(1);
                    break;
                case WsCode.UpdateMsgList:
                    console.log('接收到服务器更新数据：', data);
                    setList(data.data);
                    break;
            }
        };
        ws.onerror = () => {
            message.error('聊天断开失败！');
            ws.close();
            setStatus(0);
        };
        GetGroup({ group: select.substring(0, select.indexOf('/')) }).then((val) => {
            if (val.code) {
                setCurrentGroup(val.data as unknown as GroupInfo);
                return;
            }
            navigate('/user', { replace: true });
        });
        scrollbottom();
        return () => {
            ws.close();
            clearInterval(intervalNum);
            setStatus(0);
        };
    }, []); //eslint-disable-line

    return (
        <ChatContext.Provider value={ChatInject}>
            <Flex className={style.ChatBox} vertical>
                <Flex className={style.ChatHeader}>
                    <Flex align="center" className={style.ChatHeaderNickName}>
                        <Avatar
                            size="large"
                            icon={
                                (!currentGroup || !currentGroup?.group_avatar) && <UserOutlined />
                            }
                            src={`${ServerUrl}${currentGroup?.group_avatar?.slice(1)}`}
                        />
                        {currentGroup && currentGroup.group_name}
                    </Flex>
                    <Flex style={{ width: '100%' }} flex="1">
                        <span></span>
                    </Flex>
                    <Flex>
                        <Dropdown menu={{ items }}>
                            <MenuOutlined style={{ cursor: 'pointer' }} />
                        </Dropdown>
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
                                    closable
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
            </Flex>
        </ChatContext.Provider>
    );
}
export default ChatGroup;