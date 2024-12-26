import { Empty, Flex } from 'antd';
import style from './default.module.less';
function DefaultEmpty() {
    return (
        <>
            {/* 发送聊天将打开一个Modal 聊天框 */}
            <Flex className={style.DefaultContainer} wrap>
                <Empty className={style.DefaultEmpty} description="请选择一个朋友或群聊打开聊天" />
            </Flex>
        </>
    );
}
export default DefaultEmpty;
