import { Empty, Flex } from "antd";
import { Content } from "antd/es/layout/layout";

function People() {
	return (
		<>
			<Flex wrap>
				<Content>
					<Empty description="暂未加入任何群聊" />
				</Content>
			</Flex>
		</>
	);
}
export default People;
