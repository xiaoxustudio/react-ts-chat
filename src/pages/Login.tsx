import { Button, Checkbox, Form, Input, Card, Col, Row, message } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router";
import { omit } from "radash";
import useUserStore from "@/store/useUserStore";
import { UserInfo } from "@/types";
import { useSearchParams } from "react-router-dom";
import userContext from "@/hook/useUserContext";
import { useContext } from "react";
import { RepCode } from "@/consts";
import LoginUser, { LoginUserProp } from "@/apis/user/login-user";
import loginStyle from "@/styles/login.module.less";

type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};

function Login() {
	const navigate = useNavigate();
	const context = useContext(userContext);
	const [serchPramas] = useSearchParams();
	const [messageApi, contextHolder] = message.useMessage();
	const { setToken, setNickName, setUserName, setData } = useUserStore();
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		LoginUser(omit(values, ["remember"]) as LoginUserProp).then((data) => {
			if (data.code == RepCode.Success) {
				messageApi.success(data.msg);
				setToken(data.data.token);
				setNickName(data.data.nickname);
				setUserName(data.data.username);
				setData(data.data as unknown as UserInfo);
				context.Auth = true;
				context.AuthTime = Date.now();
				setTimeout(() => {
					// 跳转
					navigate(serchPramas.get("next") ?? "/", { replace: true });
				}, 1000);
			} else {
				messageApi.error(data.msg);
			}
		});
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo
	) => {
		console.log("Failed:", errorInfo);
	};
	const TurnRegister = () => {
		navigate("/register", { replace: true });
	};

	return (
		<>
			{contextHolder}
			<Row className={loginStyle["row-container"]}>
				<Col span={8}></Col>
				<Col className={loginStyle.container} span={8}>
					<Card className={loginStyle["login-card"]} title="后台登录">
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
								rules={[{ required: true, message: "请输入你的用户名!" }]}
							>
								<Input />
							</Form.Item>

							<Form.Item<FieldType>
								label="密码"
								name="password"
								rules={[{ required: true, message: "请输入你的密码!" }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item<FieldType>
								name="remember"
								valuePropName="checked"
								wrapperCol={{ offset: 8, span: 16 }}
							>
								<Checkbox>记住我</Checkbox>
							</Form.Item>

							<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
								<Button type="primary" htmlType="submit">
									登录
								</Button>
								<Button onClick={TurnRegister}>注册</Button>
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
