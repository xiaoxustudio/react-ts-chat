import { Button, Flex, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useLocation, useNavigate } from "react-router";
import stylesFound from "./not-found.module.less";
const layoutStyle = {
	borderRadius: 8,
	overflow: "hidden",
};
const contentStyle: React.CSSProperties = {
	textAlign: "center",
	backgroundColor: "#fff",
	position: "relative",
	height: 500,
};

const headerStyle: React.CSSProperties = {
	height: 64,
	lineHeight: "64px",
	backgroundColor: "#fff",
};
function NotFound() {
	const navigate = useNavigate();
	const handleBack = () => navigate(-1);
	const loc = useLocation();
	return (
		<>
			<Flex gap="middle" wrap>
				<Layout style={layoutStyle}>
					<Header style={headerStyle}>
						<Button onClick={handleBack}>返回上一页</Button>
					</Header>
					<Content style={contentStyle}>
						<div className={stylesFound["not-found"]}>
							404
							<div className={stylesFound["sub-found"]}>
								未找到页面：{loc.pathname}
							</div>
						</div>
					</Content>
				</Layout>
			</Flex>
		</>
	);
}

export default NotFound;
