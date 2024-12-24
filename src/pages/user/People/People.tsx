import style from "./people.module.less";
import { Flex, Empty } from "antd";
function People() {
	return (
		<>
			{/* 发送聊天将打开一个Modal 聊天框 */}
			<Flex className={style.PeopleContainer} wrap>
				<Empty
					className={style.PeopleEmpty}
					description="请选择一个朋友打开聊天"
				/>
			</Flex>
		</>
	);
}
export default People;
