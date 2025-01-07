import AvatarIcon from '@/components/AvatarIcon/AvatarIcon';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react';
import { Flex, Empty, Spin, Avatar, Tooltip, Tag } from 'antd';
import { Content } from 'antd/es/layout/layout';
import classNames from 'classnames';
import { Bold, Italic, Strikethrough } from 'lucide-react';
import useDoc from '@/store/useDoc';
import { ChangeEvent } from 'react';
import { StatesProp } from '../../types';
import ToolIcon from '../../components/ToolIcon';

interface EditorContainerProp {
    loading: boolean;
    editor: Editor | null;
    Users: StatesProp[] | undefined;
    title: string;
    onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
}

function EditorContainer({ loading, editor, Users, title, onChangeTitle }: EditorContainerProp) {
    const { select } = useDoc();
    return (
        <>
            {/* 悬浮栏 */}
            {select && editor && !loading && (
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
            <Flex className="h-full min-h-[95%] w-full overflow-y-scroll rounded border" vertical>
                {Object.keys(select).length <= 0 && (
                    <Empty
                        className="m-0 flex h-full w-full items-center justify-center"
                        description="请选择一个文档进行编辑"
                    />
                )}
                {Object.keys(select).length > 0 && (
                    <Spin wrapperClassName="h-full w-full" spinning={loading}>
                        <Flex className="w-full">
                            <Content className="w-full">
                                <input
                                    className="h-full w-full px-10 py-5 text-3xl font-bold outline-none"
                                    placeholder="请输入标题"
                                    value={title}
                                    onChange={onChangeTitle}
                                    readOnly={loading}
                                />
                            </Content>
                        </Flex>
                        <EditorContent editor={editor} />
                    </Spin>
                )}
            </Flex>
            {/* 底部 */}
            {select && editor && (
                <Flex className="py-2" gap={5}>
                    <Content>累计：{editor.storage.characterCount.characters()} 字</Content>
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
                        <Tag color={loading ? 'green' : 'red'}>{loading ? '可编辑' : '锁定'}</Tag>
                    </Flex>
                </Flex>
            )}
        </>
    );
}
export default EditorContainer;
