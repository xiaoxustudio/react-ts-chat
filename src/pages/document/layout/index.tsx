import { Button, Divider, Flex, message } from 'antd';
import Title from 'antd/es/typography/Title';
import SiderTree from './sider-tree/sider-tree';
import GetPages from '@/apis/doc/get-pages';
import useUserStore from '@/store/useUserStore';
import { RepCode } from '@/consts';
import { useEffect, useState } from 'react';
import { DocItem, DocItemData } from '@/types';
import { Content } from 'antd/es/layout/layout';
import { FileMarkdownOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import useDoc from '@/store/useDoc';
import { Key } from 'antd/es/table/interface';
import { useNavigate } from 'react-router';
import CreatePage from '@/apis/doc/create-page';

function DocumentSider() {
    const { username } = useUserStore();
    const { select, setSelect, reset } = useDoc();
    const navigate = useNavigate();
    const [PagesList, setPagesList] = useState<DocItemData[]>([]);
    const updatePages = () => {
        GetPages({ user: username }).then((data) => {
            if (data.code === RepCode.Success) {
                // message.success(data.msg);
                const list = data.data as unknown as DocItem[];
                const processData = list.map(
                    (val) =>
                        ({
                            ...val,
                            key: val.id,
                            children: [],
                            title: val.block_name,
                            icon: <FileMarkdownOutlined />,
                        }) as unknown as DocItemData,
                );
                setPagesList(processData);
            } else {
                message.error(data.msg);
            }
        });
    };

    const handleCreatePage = () =>
        CreatePage({ type: 1 }).then((data) => {
            if (data.code === RepCode.Success) {
                message.success(data.msg);
                updatePages();
            } else {
                message.error(data.msg);
            }
        });

    const onBackButton = () => {
        reset();
        navigate('/user', { replace: true });
    };

    const onSelectNode = (key: Key[]) => {
        const find = PagesList.find((val) => val.key == key[0]);
        if (!find) return;
        setSelect(find!);
    };

    useEffect(() => {
        updatePages();
    }, []); //eslint-disable-line
    return (
        <Flex className="h-full w-full" vertical>
            <Flex>
                <Content>
                    <Button size="small" onClick={onBackButton}>
                        <LeftOutlined />
                    </Button>
                </Content>
                <Title level={5}>文档</Title>
            </Flex>
            <Flex>
                <Divider />
            </Flex>
            <Flex>
                <PlusOutlined
                    className="cursor-pointer select-none rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                    onClick={handleCreatePage}
                />
            </Flex>
            <Flex>
                <SiderTree
                    defaultSelectedKeys={[select.key]}
                    list={PagesList}
                    onSelect={onSelectNode}
                />
            </Flex>
        </Flex>
    );
}
export default DocumentSider;
