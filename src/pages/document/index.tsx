import Color from '@tiptap/extension-color';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { Link } from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Empty, Flex, Input, message, Tag } from 'antd';
import CharacterCount from '@tiptap/extension-character-count';
import { ChangeEvent, useEffect, useState } from 'react';
import { WsCode, wsUrlDoc } from '@/consts';
import useUserStore from '@/store/useUserStore';
import 'prosemirror-view/style/prosemirror.css';
import useSend from '@/hook/useSend';
import Sider from 'antd/es/layout/Sider';
import DocumentSider from './layout';
import './index.less';
import { Content } from 'antd/es/layout/layout';
import useDoc from '@/store/useDoc';
import { DocItem } from '@/types';

const DocumentInstance = () => {
    const { select } = useDoc();
    const { username, token } = useUserStore();
    const { sendWrapper } = useSend();
    const [wsIns, setWsIns] = useState<WebSocket>();
    const [isEditor, setIsEditor] = useState(false);
    const [isSendConent, setIsSendContent] = useState(false);
    const [isSendTitle, setIsSendTitle] = useState(false);
    const [titleContent, setTitleContent] = useState('');
    const editor = useEditor({
        //使用扩展
        extensions: [
            StarterKit,
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
        injectCSS: false,
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

    const handleTitleContent = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (wsIns && isSendTitle && wsIns.readyState === 1) {
            wsIns.send(
                sendWrapper({
                    type: WsCode.ChangeTitle,
                    message: val,
                }),
            );
        }
        setTitleContent(val);
    };

    const handleMessage = (ws: MessageEvent) => {
        try {
            const data = JSON.parse(ws.data);
            const doc = data.data as DocItem;
            setTitleContent(doc.block_name);
            editor?.commands.setContent(data.message);
        } catch {
            wsIns?.close();
        }
    };

    useEffect(() => {
        if (!select || !select.block) return;
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
                message.success('文档连接成功！');
                if (editor) {
                    editor.setEditable(true);
                    setIsEditor(true);
                }
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
    }, [select, username, token, wsUrlDoc, editor]); //eslint-disable-line
    return (
        <Flex className="h-full w-full p-5">
            {/* 侧栏 */}
            <Sider theme="light">
                <DocumentSider />
            </Sider>
            {/* 编辑器 */}
            <Flex className="h-full w-full p-5" vertical>
                {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <div className="bubble-menu flex gap-2 rounded border bg-white px-4 py-1 shadow-sm">
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={editor.isActive('bold') ? 'is-active' : ''}
                            >
                                Bold
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={editor.isActive('italic') ? 'is-active' : ''}
                            >
                                Italic
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                className={editor.isActive('strike') ? 'is-active' : ''}
                            >
                                Strike
                            </button>
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
                                placeholder="请输入内容"
                            />
                        </>
                    )}
                </Flex>
                {select && (
                    <Flex className="py-2" gap={5}>
                        <Content>
                            累计：{editor && editor.storage.characterCount.characters()} 字
                        </Content>
                        <Tag color={isEditor ? 'green' : 'red'}>{isEditor ? '可编辑' : '锁定'}</Tag>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
export default DocumentInstance;
