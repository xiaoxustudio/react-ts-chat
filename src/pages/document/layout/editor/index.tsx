import { useEditor } from '@tiptap/react';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import { wsUrlDoc } from '@/consts';
import useUserStore from '@/store/useUserStore';
import 'prosemirror-view/style/prosemirror.css';
import Sider from 'antd/es/layout/Sider';
import DocumentSider from '..';
import useDoc from '@/store/useDoc';
import collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';

import * as Y from 'yjs';
import { HocuspocusProvider, onAwarenessUpdateParameters } from '@hocuspocus/provider';
import extensions from '../../extensions';
import { generateRandomColors } from '@/utils';
import EditorContainer from './editor';
import { StatesProp } from '../../types';
import './index.less';

const colors = generateRandomColors(10); // 生成随机颜色

const DocumentInstance = () => {
    const { select } = useDoc();
    const { data: userData, token } = useUserStore();
    const [extensionConfig, setExtnsionConfig] = useState<any[]>(extensions);
    const [titleContent, setTitleContent] = useState('');
    const [loadingState, setLoadingState] = useState(false);
    const [Provider, setProvider] = useState<HocuspocusProvider>();
    const [_, setCurrentYdoc] = useState<Y.Doc>();
    const [currentYText, setCurrentYText] = useState<Y.Text>();
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
        if (!currentYText) return;
        const handleObserve = (yy: Y.YTextEvent) => {
            const text = yy.target.toString();
            setTitleContent(text);
        };
        currentYText.observe(handleObserve);
        return () => {
            currentYText.unobserve(handleObserve);
        };
    }, [currentYText]);

    useEffect(() => {
        if (!select || !select?.block) return;
        if (Provider instanceof HocuspocusProvider) {
            Provider.destroy();
        }
        const ydoc = new Y.Doc();
        const titleYtext = ydoc.getText('title');
        setCurrentYdoc(ydoc);
        setCurrentYText(titleYtext);
        setLoadingState(true);
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
            token,
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
                <EditorContainer
                    Users={Users}
                    editor={EditorIns}
                    loading={loadingState}
                    onChangeTitle={(e) => {
                        if (!currentYText) return;
                        currentYText.delete(0, currentYText.length);
                        currentYText.insert(e.target.selectionStart ?? 0, e.target.value);
                        setTitleContent(e.target.value);
                    }}
                    title={titleContent}
                />
            </Flex>
        </Flex>
    );
};
export default DocumentInstance;
