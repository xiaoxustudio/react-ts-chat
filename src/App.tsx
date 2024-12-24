import { Outlet } from "react-router";
import Lodding from "./pages/Lodding";
import HeaderMenu from "./components/Header";
import { Flex } from "antd";

function App() {
	return (
		<Flex vertical>
			<HeaderMenu></HeaderMenu>
			<Lodding children={<Outlet />}></Lodding>
		</Flex>
	);
}

export default App;
