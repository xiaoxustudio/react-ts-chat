import Color from '@tiptap/extension-color';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { Link } from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Avatar, Empty, Flex, message, Spin, Tag, Tooltip } from 'antd';
import CharacterCount from '@tiptap/extension-character-count';
import { ChangeEvent, useEffect, useState } from 'react';
import { WsCode, wsUrlDoc } from '@/consts';
import useUserStore from '@/store/useUserStore';
import 'prosemirror-view/style/prosemirror.css';
import useSend from '@/hook/useSend';
import Sider from 'antd/es/layout/Sider';
import DocumentSider from './layout';
import { Content } from 'antd/es/layout/layout';
import useDoc from '@/store/useDoc';
import { DocItem, DocPeople } from '@/types';
import { debounce } from 'radash';
import sideDocrBus from '@/event-bus/sider-doc-bus';
import Placeholder from '@tiptap/extension-placeholder';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import classNames from 'classnames';
import { Bold, Italic, Strikethrough } from 'lucide-react';
import ToolIcon from './components/ToolIcon';
import './index.less';

const DocumentInstance = () => {
    const { select } = useDoc();
    const { username, token } = useUserStore();
    const { sendWrapper } = useSend();
    const [wsIns, setWsIns] = useState<WebSocket>();
    const [isEditor, setIsEditor] = useState(false);
    const [isSendConent, setIsSendContent] = useState(false);
    const [isSendTitle, setIsSendTitle] = useState(false);
    const [titleContent, setTitleContent] = useState('');
    const [PeopleArr, setPeopleArr] = useState([] as DocPeople[]);
    const [loadingState, setLoadingState] = useState(false);

    const editor = useEditor({
        //使用扩展
        extensions: [
            StarterKit.configure({}),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'paragraph') {
                        return '请输入内容';
                    }

                    return '';
                },
            }),
            Image,
            Link,
            Color.configure({
                types: ['textStyle'],
            }),
            CharacterCount.configure({}),
        ],
        content: '',
        // 编辑器自动获取焦点
        autofocus: true,
        // 编辑器是否可用
        editable: isEditor,
        injectCSS: true,
        onFocus() {
            setIsSendContent(true);
        },
        onBlur() {
            setIsSendContent(false);
        },
        onUpdate({ editor }) {
            if (wsIns && isSendConent && wsIns.readyState === 1) {
                wsIns.send(
                    sendWrapper({
                        type: WsCode.ChangeContent,
                        message: editor.getHTML(),
                    }),
                );
            }
        },
        onTransaction: debounce({ delay: 500 }, ({ editor }) => {
            if (wsIns && isSendConent && wsIns.readyState === 1) {
                wsIns.send(
                    sendWrapper({
                        type: WsCode.ChangeContent,
                        message: editor.getHTML(),
                    }),
                );
            }
        }),
    });

    const handleError = () => {
        message.error('文档连接失败！');
        if (!wsIns) return;
        wsIns.close();
    };
    const handleClose = () => {
        if (!wsIns) return;
        wsIns.close();
    };

    const updateSider = debounce({ delay: 400 }, () => {
        sideDocrBus.emit('updateSider');
    });

    const handleTitleContent = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (wsIns && isSendTitle && wsIns.readyState === 1) {
            wsIns.send(
                sendWrapper({
                    type: WsCode.ChangeTitle,
                    message: val,
                }),
            );
            updateSider();
        }
        setTitleContent(val);
    };

    const handleMessage = (ws: MessageEvent) => {
        try {
            const _data = JSON.parse(ws.data);
            const data = _data.data;
            const people = data?.people_data;
            const doc = data?.doc_data as DocItem;
            if (doc) {
                setTitleContent(doc.block_name);
                setIsEditor(doc.status === 1);
                editor?.commands.setContent(doc.content);
            }
            if (people) {
                setPeopleArr(people);
            }
        } catch {
            wsIns?.close();
        }
    };

    useEffect(() => {
        if (!select || !select.block) return;
        if (wsIns instanceof WebSocket) wsIns.close();
        setLoadingState(true);
        const ws = new WebSocket(
            `${wsUrlDoc}?user=${username}&token=${token}&block=${select.block}`,
        );
        const HandleOpen = () => {
            if (ws.readyState === 1) {
                // 建立连接通道
                ws.send(
                    sendWrapper({
                        type: WsCode.CreateChannel,
                        message: 'CreateChannel',
                        data: {
                            target: username,
                        },
                    }),
                );
                // message.success('文档连接成功！');
                if (editor) {
                    editor.setEditable(true);
                    setIsEditor(true);
                }
                setLoadingState(false);
            }
        };
        ws.onopen = HandleOpen;
        ws.onmessage = handleMessage;
        ws.onclose = handleClose;
        ws.onerror = handleError;
        setWsIns(ws);
        return () => {
            ws.close();
        };
    }, [select]); //eslint-disable-line
    return (
        <Flex className="h-full w-full p-5">
            {/* 侧栏 */}
            <Sider theme="light">
                <DocumentSider />
            </Sider>
            {/* 编辑器 */}
            <Flex className="h-full w-full p-5" vertical>
                {/* 悬浮栏 */}
                {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <div className="bubble-menu flex gap-2 rounded border bg-white px-4 py-1 shadow-sm">
                            <ToolIcon
                                icon={<Bold />}
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={editor.isActive('bold') ? 'is-active' : ''}
                            />
                            <ToolIcon
                                icon={<Italic />}
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={editor.isActive('italic') ? 'is-active' : ''}
                            />
                            <ToolIcon
                                icon={<Strikethrough />}
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                className={editor.isActive('strike') ? 'is-active' : ''}
                            />
                        </div>
                    </BubbleMenu>
                )}
                {/* 编辑器实例 */}
                <Flex
                    className="h-[95%] min-h-[95%] w-full overflow-y-scroll rounded border"
                    align="center"
                    vertical
                >
                    {!select && <Empty className="w-full" description="请选择一个文档进行编辑" />}
                    {select && (
                        <>
                            <Spin wrapperClassName="h-full w-full" spinning={loadingState}>
                                <Flex className="w-full">
                                    <Content className="w-full">
                                        <input
                                            className="h-full w-full px-10 py-5 text-3xl font-bold outline-none"
                                            placeholder="请输入标题"
                                            value={titleContent}
                                            onFocus={() => setIsSendTitle(true)}
                                            onBlur={() => setIsSendTitle(false)}
                                            onChange={handleTitleContent}
                                            readOnly={!isEditor}
                                        />
                                    </Content>
                                </Flex>
                                <EditorContent
                                    className="h-full w-full outline-none"
                                    editor={editor}
                                />
                            </Spin>
                        </>
                    )}
                </Flex>
                {select && (
                    <Flex className="py-2" gap={5}>
                        <Content>
                            累计：{editor && editor.storage.characterCount.characters()} 字
                        </Content>
                        <Content>
                            <Avatar.Group>
                                {PeopleArr.map((val) => (
                                    <Tooltip
                                        key={val.user_id}
                                        title={val.user_data.nickname}
                                        placement="top"
                                    >
                                        <AvatarIcon
                                            className={classNames(
                                                'cursor-pointer shadow-md',
                                                select.user_id === val.user_id &&
                                                    'shadow-green-300',
                                            )}
                                            size="small"
                                            url={val.user_data.avatar}
                                        />
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </Content>
                        <Flex align="center">
                            <Tag color={isEditor ? 'green' : 'red'}>
                                {isEditor ? '可编辑' : '锁定'}
                            </Tag>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
export default DocumentInstance;
