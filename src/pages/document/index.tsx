import { Flex } from 'antd';
import Loading from '../Loading';
import { Outlet } from 'react-router';

function Document() {
    return (
        <Flex className="h-full w-full">
            <Loading children={<Outlet />} />
        </Flex>
    );
}
export default Document;
