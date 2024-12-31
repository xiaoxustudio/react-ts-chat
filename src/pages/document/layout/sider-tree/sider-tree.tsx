import { DocItemData } from '@/types';
import { Flex, Tree, TreeProps } from 'antd';
import { useEffect, useState } from 'react';
import './sider-tree.less';
import { FileMarkdownOutlined } from '@ant-design/icons';

interface SiderTreeProp extends TreeProps {
    list: DocItemData[];
}

function SiderTree({ list, ...reset }: SiderTreeProp) {
    const [ListData, setListData] = useState<DocItemData[]>([]);
    useEffect(() => {
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
        setListData(processData);
    }, [list]);
    return (
        <Flex className="w-full">
            <Tree className="w-full" treeData={ListData} showLine showIcon {...reset} />
        </Flex>
    );
}
export default SiderTree;
