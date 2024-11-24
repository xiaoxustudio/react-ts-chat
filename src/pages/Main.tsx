import { Button, Flex, Layout, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { FC, useEffect } from "react";
import { Post } from "@/alova";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import styles from "./Main.module.less";
import withAuth from "@/hook/useWithAuth";

interface ItemArray {
	label: string;
	content: string;
}
const Main: FC = withAuth(() => {
	const ItemHome: ItemArray[] = [
		{
			label: "免费",
			content: "入驻平台不需要支付任何费用",
		},
		{
			label: "开源",
			content: "本系统开源，可在GitHub下载",
		},
		{
			label: "交友",
			content: "可在平台上进行交友",
		},
	];
	const baseStyle: React.CSSProperties = {
		width: `${100 / ItemHome.length}%`,
	};
	useEffect(() => {
		Post("/api/home/get-home").then((data) => {
			switch (data.code) {
				case 1:
					message.success(data.msg);
					break;
			}
		});
	}, []);

	return (
		<>
			<Layout className={styles.layout}>
				<Content style={{ padding: "50px 50px" }}>
					<div className={styles["site-layout-content"]}>
						<Title level={1}>交交友</Title>
						<Paragraph>一款免费、开源、能够交到朋友的交友系统.</Paragraph>
						<Button type="primary">Get Started</Button>
					</div>
					<Flex className={styles["site-layout-flex"]}>
						{ItemHome.map((val, i) => (
							<div
								className={styles["site-layout-sub"]}
								key={i}
								style={{
									...baseStyle,
								}}
							>
								<Title level={4} color="#fff">
									{val.label}
								</Title>
								<Content>{val.content}</Content>
							</div>
						))}
					</Flex>
				</Content>
			</Layout>
		</>
	);
});
export default Main;
