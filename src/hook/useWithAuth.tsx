import useUserStore from "@/store/useUserStore";
import { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router";
import userContext from "./useUserContext";
import { Post } from "@/alova";
import { message } from "antd";
import { RepCode } from "@/consts";

const withAuth = (Component: FC) => {
	const AuthenticatedComponent = (props: JSX.IntrinsicAttributes) => {
		const navigate = useNavigate();
		const { token } = useUserStore();
		const { pathname } = useLocation();
		const context = useContext(userContext);
		if (!token) {
			return <Navigate to={`/login?next=${pathname}`} />;
		}
		// 二次登录验证
		if (!context.Auth) {
			context.isAuthRequstSending = true;
			const get = () =>
				Post("/api/user/valid-token", { token })
					.then((data) => {
						if (data.code == RepCode.Success) {
							context.isAuthRequstSending = false;
							context.Auth = true;
							context.AuthTime = Date.now();
						} else {
							throw new Error("no request");
						}
					})
					.catch(() => {
						// 如果重复次数超出，则重新登录
						if (context.retry >= 3) {
							message.error("token 验证失败");
							setTimeout(() => {
								navigate(`/login?next=${pathname}`, { replace: true });
							}, 1000);
						} else {
							context.retry += 1;
							setTimeout(() => get(), 500);
						}
					});
			get();
			return <Component {...props} />;
		} else {
			return <Component {...props} />;
		}
	};

	return AuthenticatedComponent;
};
export default withAuth;
