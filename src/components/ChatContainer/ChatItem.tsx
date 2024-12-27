import { Flex, Image, Popover, Tag } from 'antd';
import classNames from 'classnames';
import { forwardRef, useContext, useState } from 'react';
import { ServerUrl } from '@/consts';
import { Content } from 'antd/es/layout/layout';
import useUserStore from '@/store/useUserStore';
import { MoreOutlined } from '@ant-design/icons';
import ChatContext from './utils/ChatContext';
import { ChatItemType, GroupChatItemData, type ChatItemData } from './type';
import TextArea from 'antd/es/input/TextArea';
import AvatarIcon from '../AvatarIcon/AvatarIcon';
import style from './chat-item.module.less';

interface ChatItemProps {
    item: ChatItemData;
    index: number;
    type: 'user' | 'group';
}
interface MenuItemDataProps {
    target: string;
    index: number;
}

function MenuItemData({ target, index }: MenuItemDataProps) {
    const { onWidthDraw } = useContext(ChatContext);
    return (
        <Flex vertical>
            <Content className={style.menuBtn} onClick={() => onWidthDraw?.({ target, index })}>
                撤回
            </Content>
        </Flex>
    );
}

const ChatItem = forwardRef<HTMLDivElement, ChatItemProps>((props, ref) => {
    const { item, index, type, ...reset } = props;
    const { group_id } = useContext(ChatContext);
    const { username } = useUserStore();
    const r_id = type === 'group' ? item.receive_id : group_id;
    const [_, setHover] = useState(false);

    return (
        <Flex
            ref={ref}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            justify={item.send_id === username ? 'right' : 'left'}
            className={classNames(style.ChatItemBox)}
            vertical
            {...reset}
        >
            {(+item.type as ChatItemType) === ChatItemType.System && (
                <>
                    <Flex className={style.ChatItemBack}>{item.content}</Flex>
                </>
            )}
            {(+item.type as ChatItemType) === ChatItemType.Common && (
                <>
                    {/* 用户名称 */}
                    <Flex
                        className={style.NickName}
                        justify={item.send_id === username ? 'right' : 'left'}
                    >
                        {type === 'group' && item.send_id === username && (
                            <>
                                {(item as GroupChatItemData).send_data.auth == 2 && (
                                    <Tag bordered={false} color="orange">
                                        群主
                                    </Tag>
                                )}
                                {(item as GroupChatItemData).send_data.auth == 1 && (
                                    <Tag bordered={false} color="green">
                                        管理
                                    </Tag>
                                )}
                                {(item as GroupChatItemData).send_data.auth == 0 && (
                                    <Tag bordered={false}>成员</Tag>
                                )}
                            </>
                        )}
                        {item.send_id !== username && <AvatarIcon url={item.avatar} />}
                        {item.nickname}
                        {item.send_id === username && <AvatarIcon url={item.avatar} />}
                        {type === 'group' && item.send_id !== username && (
                            <>
                                {(item as GroupChatItemData).send_data.auth == 2 && (
                                    <Tag bordered={false} color="orange">
                                        群主
                                    </Tag>
                                )}
                                {(item as GroupChatItemData).send_data.auth == 1 && (
                                    <Tag bordered={false} color="green">
                                        管理
                                    </Tag>
                                )}
                                {(item as GroupChatItemData).send_data.auth == 0 && (
                                    <Tag bordered={false}>成员</Tag>
                                )}
                            </>
                        )}
                    </Flex>
                    {/* 内容 */}
                    <Flex
                        className={`${style.Content} justify-between`}
                        justify={item.send_id === username ? 'right' : 'left'}
                    >
                        {item.send_id === username && <Content>{''}</Content>}
                        <TextArea
                            className={classNames(
                                'inline-block !max-w-[640px] border-none hover:shadow-none',
                                { 'text-right': item.send_id === username },
                            )}
                            value={item.content}
                            autoSize
                            readOnly
                        ></TextArea>
                        {item.send_id !== username && <Content>{''}</Content>}
                    </Flex>
                    {/* 附件 */}
                    <Flex justify={item.send_id === username ? 'right' : 'left'}>
                        {item.files.map((val) => (
                            <Image key={val} width={50} height={50} src={`${ServerUrl}/${val}`} />
                        ))}
                    </Flex>
                    {item.files.length > 0 && (
                        <Flex
                            justify={item.send_id === username ? 'right' : 'left'}
                            style={{ fontSize: '10px', color: '#ccc' }}
                        >
                            携带文件数：{item.files.length}
                        </Flex>
                    )}
                    {/* 时间 */}
                    <Flex
                        className={style.Time}
                        justify={item.send_id === username ? 'right' : 'left'}
                    >
                        {item.send_id === username && (
                            <Popover
                                trigger="hover"
                                placement="left"
                                content={<MenuItemData target={r_id!} index={index} />}
                            >
                                <MoreOutlined className={style.menuBtn} />
                            </Popover>
                        )}
                        {item.time}
                        {item.send_id !== username && (
                            <Popover trigger="hover" placement="right">
                                <MoreOutlined className={style.menuBtn} />
                            </Popover>
                        )}
                    </Flex>
                </>
            )}
        </Flex>
    );
});
export default ChatItem;
