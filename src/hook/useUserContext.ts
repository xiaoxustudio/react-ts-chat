import { createContext } from "react";
interface ContextProp {
	Auth: boolean; // 是否认证
	AuthTime: number; // 认证时间
	retry: number; // 重复发送次数
	isAuthRequstSending: boolean; // 是否正在发送认证
}
const useUserContext = createContext<ContextProp>({
	Auth: false,
	AuthTime: 0,
	isAuthRequstSending: false,
	retry: 0,
});
export default useUserContext;
