import { useEffect } from "react";
import { Flex, Empty } from "antd";
function People() {
	useEffect(() => {}, []);
	return (
		<>
			{/* 发送聊天将打开一个Modal 聊天框 */}
			<Flex wrap>
				<Empty description="不能打开聊天" />
			</Flex>
		</>
	);
}
export default People;
