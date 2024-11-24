import { redirect, RouteObject } from "react-router-dom";
import { lazy } from "react";
import App from "@/App";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import User from "@/pages/user/User";
import NotFound from "@/pages/not-found/NotFound";
const routes: RouteObject[] = [
	{
		path: "/",
		loader: () => redirect("/home"),
	},
	{
		element: <App />,
		children: [
			{
				index: true,
				path: "home",
				Component: lazy(() => import("@/pages/Main")),
			},
			{
				path: "user",
				element: <User />,
				children: [
					{
						index: true,
						path: "chat-people",
						Component: lazy(() => import("@/pages/user/People/People")),
					},
					{
						path: "chat-group",
						Component: lazy(() => import("@/pages/user/Group/Group")),
					},
					{
						path: "user-info",
						Component: lazy(() => import("@/pages/user/UserInfo/user-info")),
					},
					{
						path: ":user_id/chat",
						Component: lazy(() => import("@/pages/user/Chat/Chat")),
					},
				],
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		// 404 页面，确保放在最后
		path: "*",
		element: <NotFound />,
	},
];

export default routes;
