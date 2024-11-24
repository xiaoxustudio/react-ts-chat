import { Button, Checkbox, Form, Input, Card, Col, Row, message } from "antd";
import type { FormProps } from "antd";
import loginStyle from "@/styles/login.module.less";
import { useNavigate } from "react-router";
import { Post } from "@/alova";
import { omit } from "radash";
import { useSearchParams } from "react-router-dom";
import { RepCode } from "@/consts";
type FieldType = {
	username?: string;
	password?: string;
	repassword?: string;
	email?: string;
	remember?: boolean;
};

function Login() {
	const navigate = useNavigate();
	const [serchPramas] = useSearchParams();
	const [messageApi, contextHolder] = message.useMessage();
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		Post("/api/user/register", omit(values, ["remember"])).then((data) => {
			if (data.code == RepCode.Success) {
				messageApi.success("注册成功!");
				setTimeout(TurnLogin, 1000);
			} else {
				messageApi.error("注册失败！" + data.msg);
			}
		});
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo
	) => {
		messageApi.error("请检查表单的信息!");
		console.log("Failed:", errorInfo);
	};
	const TurnLogin = () => {
		const next_path = serchPramas.get("next");
		navigate(`/login?next=${next_path ?? "/"}`, { replace: true });
	};

	return (
		<>
			{contextHolder}
			<Row className={loginStyle["row-container"]}>
				<Col span={8}></Col>
				<Col className={loginStyle.container} span={8}>
					<Card className={loginStyle["login-card"]} title="后台注册">
						<Form
							name="basic"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							style={{ maxWidth: 600 }}
							initialValues={{ remember: true }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
						>
							<Form.Item<FieldType>
								label="用户名"
								name="username"
								rules={[
									{ required: true, message: "请输入你的用户名!" },
									{
										type: "string",
										min: 2,
										max: 10,
										message: "用户名的长度为2-10个字符",
									},
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item<FieldType>
								label="密码"
								name="password"
								rules={[
									{ required: true, message: "请输入你的密码!" },
									{
										type: "string",
										min: 2,
										max: 15,
										message: "密码的长度为2-15个字符",
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item<FieldType>
								label="重复密码"
								name="repassword"
								rules={[
									{ required: true, message: "请输入你的重复密码!" },
									{
										type: "string",
										min: 2,
										max: 15,
										message: "重复密码的长度为2-15个字符",
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item<FieldType>
								label="邮箱"
								name="email"
								rules={[
									{ required: true, message: "请输入你的邮箱!" },
									{
										type: "string",
										min: 4,
										max: 20,
										message: "邮箱的长度为4-20个字符",
									},
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item<FieldType>
								name="remember"
								valuePropName="checked"
								wrapperCol={{ offset: 8, span: 16 }}
							>
								<Checkbox>记住我</Checkbox>
							</Form.Item>
							<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
								<Button block type="primary" htmlType="submit">
									注册
								</Button>
								or
								<a href="" onClick={TurnLogin}>
									登录
								</a>
							</Form.Item>
						</Form>
					</Card>
				</Col>
				<Col span={8}></Col>
			</Row>
		</>
	);
}
export default Login;
