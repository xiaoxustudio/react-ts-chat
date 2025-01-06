import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { Avatar, Empty, Flex, Spin, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { wsUrlDoc } from '@/consts';
import useUserStore from '@/store/useUserStore';
import 'prosemirror-view/style/prosemirror.css';
import Sider from 'antd/es/layout/Sider';
import DocumentSider from './layout';
import { Content } from 'antd/es/layout/layout';
import useDoc from '@/store/useDoc';
import { UserInfo } from '@/types';
import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import classNames from 'classnames';
import collaboration from '@tiptap/extension-collaboration';
import { Bold, Italic, Strikethrough } from 'lucide-react';
import ToolIcon from './components/ToolIcon';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { HocuspocusProvider, onAwarenessUpdateParameters } from '@hocuspocus/provider';
import extensions from './extensions';
import { generateRandomColors } from '@/utils';
import './index.less';

const ydoc = new Y.Doc();
const titleYtext = ydoc.getText('title');

interface StatesProp {
    clientId: number;
    cursor: any;
    user: any;
    userInfo: UserInfo;
}

const colors = generateRandomColors(10); // 生成随机颜色

const DocumentInstance = () => {
    const { select } = useDoc();
    const { data: userData } = useUserStore();
    const [extensionConfig, setExtnsionConfig] = useState<any[]>(extensions);
    const [titleContent, setTitleContent] = useState('');
    const [loadingState, setLoadingState] = useState(false);
    const [_, setProvider] = useState<HocuspocusProvider>();
    const [Users, setUsers] = useState<StatesProp[]>();
    const EditorIns = useEditor(
        {
            extensions: extensionConfig,
            enableContentCheck: true,
            onContentError({ disableCollaboration }) {
                disableCollaboration();
            },
        },
        [extensionConfig],
    );

    // const updateSider = debounce({ delay: 400 }, () => {
    //     sideDocrBus.emit('updateSider');
    // });

    useEffect(() => {
        const handleObserve = (yy: Y.YTextEvent) => {
            const text = yy.target.toString();
            setTitleContent(text);
        };
        titleYtext.observe(handleObserve);
        return () => {
            titleYtext.unobserve(handleObserve);
        };
    }, []);

    useEffect(() => {
        if (!select || !select?.block) return;
        setLoadingState(true);
        // 清除缓存
        const indexName = `xuran-doc-${select.block}`;
        indexedDB.deleteDatabase(indexName);
        new IndexeddbPersistence(indexName, ydoc); // 本地持久化，暂时不用，以后有时间写
        const handleAwareness = ({ states }: onAwarenessUpdateParameters) => {
            const users = states as unknown as StatesProp[];
            if (users) {
                // 过滤重复
                const userName: string[] = [];
                setUsers(
                    users.filter(({ userInfo: val }) => {
                        if (userName.includes(val.username)) {
                            return false;
                        } else {
                            userName.push(val.username);
                            return true;
                        }
                    }),
                );
            }
        };
        const provider = new HocuspocusProvider({
            url: wsUrlDoc,
            name: select.block,
            document: ydoc,
            onAwarenessUpdate: handleAwareness,
        });
        const color = colors[Math.floor(Math.random() * 10)];
        if (!provider.awareness) return;
        provider.awareness.setLocalStateField('userInfo', {
            ...userData,
            color,
        });
        provider.subscribeToBroadcastChannel();

        setExtnsionConfig([
            ...extensions,
            collaboration.configure({
                document: ydoc,
                field: 'default',
                fragment: ydoc.getXmlFragment('default'),
            }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: userData.username,
                    color,
                },
            }),
        ]);

        setProvider(provider);
        setLoadingState(false);
        return () => {
            provider.destroy();
        };
    }, [select]); //eslint-disable-line

    return (
        <Flex className="h-full w-full p-5">
            {/* 侧栏 */}
            <Sider theme="light" width={200}>
                <DocumentSider />
            </Sider>
            {/* 编辑器 */}
            <Flex className="h-full w-full p-5" vertical>
                {/* 悬浮栏 */}
                {select && EditorIns && !loadingState && (
                    <BubbleMenu editor={EditorIns} tippyOptions={{ duration: 100 }}>
                        <div className="bubble-menu flex gap-2 rounded border bg-white px-4 py-1 shadow-sm">
                            <ToolIcon
                                icon={<Bold />}
                                onClick={() => EditorIns.chain().focus().toggleBold().run()}
                                className={EditorIns.isActive('bold') ? 'is-active' : ''}
                            />
                            <ToolIcon
                                icon={<Italic />}
                                onClick={() => EditorIns.chain().focus().toggleItalic().run()}
                                className={EditorIns.isActive('italic') ? 'is-active' : ''}
                            />
                            <ToolIcon
                                icon={<Strikethrough />}
                                onClick={() => EditorIns.chain().focus().toggleStrike().run()}
                                className={EditorIns.isActive('strike') ? 'is-active' : ''}
                            />
                        </div>
                    </BubbleMenu>
                )}
                {/* 编辑器实例 */}
                <Flex
                    className="h-full min-h-[95%] w-full overflow-y-scroll rounded border"
                    vertical
                >
                    {Object.keys(select).length <= 0 && (
                        <Empty
                            className="m-0 flex h-full w-full items-center justify-center"
                            description="请选择一个文档进行编辑"
                        />
                    )}
                    {Object.keys(select).length > 0 && (
                        <Spin wrapperClassName="h-full w-full" spinning={loadingState}>
                            <Flex className="w-full">
                                <Content className="w-full">
                                    <input
                                        className="h-full w-full px-10 py-5 text-3xl font-bold outline-none"
                                        placeholder="请输入标题"
                                        value={titleContent}
                                        onChange={(e) => {
                                            titleYtext.delete(0, titleYtext.length);
                                            titleYtext.insert(
                                                e.target.selectionStart ?? 0,
                                                e.target.value,
                                            );
                                            setTitleContent(e.target.value);
                                        }}
                                        readOnly={loadingState}
                                    />
                                </Content>
                            </Flex>
                            <EditorContent editor={EditorIns} />
                        </Spin>
                    )}
                </Flex>
                {/* 底部 */}
                {select && EditorIns && (
                    <Flex className="py-2" gap={5}>
                        <Content>累计：{EditorIns.storage.characterCount.characters()} 字</Content>
                        <Content>
                            <Avatar.Group>
                                {Users &&
                                    Users.map(({ clientId, userInfo }) => (
                                        <Tooltip
                                            key={clientId}
                                            title={userInfo.nickname}
                                            placement="top"
                                        >
                                            <AvatarIcon
                                                className={classNames(
                                                    'cursor-pointer shadow-md',
                                                    select.user_id === userInfo.username &&
                                                        'shadow-green-300',
                                                )}
                                                size="small"
                                                url={userInfo.avatar}
                                            />
                                        </Tooltip>
                                    ))}
                            </Avatar.Group>
                        </Content>
                        <Flex align="center">
                            <Tag color={loadingState ? 'green' : 'red'}>
                                {loadingState ? '可编辑' : '锁定'}
                            </Tag>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
export default DocumentInstance;
