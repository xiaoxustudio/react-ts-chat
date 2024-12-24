import { Flex } from "antd";
import Lodding from "./pages/Lodding";
// import HeaderMenu from "./components/Header";
import { Outlet } from "react-router";

function App() {
	return (
		<Flex vertical>
			{/* <HeaderMenu></HeaderMenu> */}
			<Lodding children={<Outlet />}></Lodding>
		</Flex>
	);
}

export default App;
