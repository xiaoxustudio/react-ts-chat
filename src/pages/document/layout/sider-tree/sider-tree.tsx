import { DocItemData, DocPeople, UserFriend } from '@/types';
import { Dropdown, Flex, MenuProps, message, Modal, Select, Tree, TreeProps } from 'antd';
import { useEffect, useState } from 'react';
import { EllipsisOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { DataNode } from 'antd/es/tree';
import './sider-tree.less';
import DeletePage from '@/apis/doc/del-page';
import { RepCode } from '@/consts';
import sideDocrBus from '@/event-bus/sider-doc-bus';
import useDoc from '@/store/useDoc';
import { clone } from 'radash';
import GetFriend from '@/apis/user/get-friend';
import useUserStore from '@/store/useUserStore';
import InvitePeople from '@/apis/doc/invite-people';
import GetPageColls from '@/apis/doc/get-page-colls';

interface SiderTreeProp extends TreeProps {
    list: DocItemData[];
}

function SiderTree({ list, ...reset }: SiderTreeProp) {
    const { select, setSelect, reset: resetSelect } = useDoc();
    const { username } = useUserStore();
    const [ListData, setListData] = useState<DocItemData[]>([]);
    const [currentItem, setCurrentItem] = useState<DocItemData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [firendsArr, setFirendsArr] = useState<UserFriend[]>([]);
    const [selectArr, setSelectArr] = useState<string[]>([]);
    const [selectLoading, setSelectLoading] = useState(false);

    const TitleRender = (node: DataNode) => {
        const items: MenuProps['items'] = [
            {
                label: '权限设置',
                key: '0',
                onClick(e) {
                    e.domEvent.stopPropagation();
                },
            },
            {
                label: '邀请协作',
                key: '1',
                onClick(e) {
                    e.domEvent.stopPropagation();
                    showModal();
                },
            },
            {
                type: 'divider',
            },
            {
                label: <span className="text-red-500">删除页面</span>,
                key: '3',
                onClick(e) {
                    if (!currentItem) return;
                    e.domEvent.stopPropagation();
                    DeletePage({ block: currentItem.block! }).then((data) => {
                        if (data.code === RepCode.Success) {
                            const clist = clone(ListData);
                            const find = clist.findIndex((val) => val.key == select.key);
                            if (find !== -1) {
                                // 判断当前的select是否被删除，如果被删除，则选择它上面一个，如果是第一个，则选择第二个
                                if (find === clist.length - 1 || find !== 0) {
                                    setSelect(clist[find - 1]);
                                } else if (find === 0) {
                                    setSelect(clist[1]);
                                } else {
                                    resetSelect();
                                }
                            }
                            sideDocrBus.emit('updateSider');
                            message.success(data.msg);
                        } else {
                            message.error(data.msg);
                        }
                    });
                },
            },
        ];
        return (
            <Flex className="flex-row" gap={5}>
                <FileMarkdownOutlined />
                <Content className="w-14 overflow-hidden text-ellipsis text-nowrap">
                    {node.title instanceof Function ? node.title(node) : node.title}
                </Content>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <EllipsisOutlined
                        className="select-none rounded p-2 transition-colors duration-200 hover:bg-gray-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentItem(node as DocItemData);
                        }}
                    />
                </Dropdown>
            </Flex>
        );
    };

    const showModal = () => {
        setSelectLoading(true);
        GetPageColls({ block: currentItem!.block! })
            .then((data) => {
                if (data.code === RepCode.Success) {
                    const dataList = data.data as DocPeople[];
                    const colls = dataList.map((val) => val.user_id);
                    if (colls && colls.length > 1) {
                        return colls;
                    }
                }
            })
            .then((colls) => {
                GetFriend({ user: username }).then((data) => {
                    if (data.code === RepCode.Success) {
                        const fdata = (data.data as UserFriend[]).map((val) => ({
                            ...val,
                            label: `${val.friend_data.nickname}(${val.friend_id})`,
                            value: val.friend_id,
                        }));
                        setFirendsArr(fdata);
                        // 既是朋友，又不在协助者中就可以邀请
                        if (colls) {
                            const selects = colls.filter(
                                (val) =>
                                    fdata.findIndex((v) => v.friend_id === val) !== -1 &&
                                    val !== username &&
                                    val,
                            );
                            setSelectArr(selects);
                        }
                    }
                    setSelectLoading(false);
                    setIsModalOpen(true);
                });
            });
    };

    const handleOk = () => {
        setIsModalOpen(false);
        InvitePeople({ block: currentItem!.block!, users: selectArr }).then((data) => {
            if (data.code === RepCode.Success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
            setSelectArr([]);
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectArr([]);
    };

    const handleSelect = (value: string) => {
        setSelectArr([...selectArr, value]);
    };

    useEffect(() => {
        const processData = list.map(
            (val) =>
                ({
                    ...val,
                    key: val.id,
                    children: [],
                    title: val.block_name,
                }) as unknown as DocItemData,
        );
        setListData(processData);
    }, [list]);
    return (
        <Flex className="w-full">
            <Tree
                className="w-full"
                titleRender={TitleRender}
                treeData={ListData}
                showLine
                {...reset}
            />
            {isModalOpen && (
                <Modal
                    title="邀请协作"
                    open={isModalOpen}
                    okText="邀请"
                    onOk={handleOk}
                    cancelText="取消"
                    onCancel={handleCancel}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="请选择一个或多个用户"
                        defaultValue={selectArr}
                        options={firendsArr}
                        loading={selectLoading}
                        onSelect={handleSelect}
                    />
                </Modal>
            )}
        </Flex>
    );
}
export default SiderTree;
