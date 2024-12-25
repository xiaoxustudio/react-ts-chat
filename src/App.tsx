import Lodding from "./pages/Lodding";
// import HeaderMenu from "./components/Header";
import { Outlet } from "react-router";

function App() {
	return (
		<>
			{/* <HeaderMenu></HeaderMenu> */}
			<Lodding children={<Outlet />} />
		</>
	);
}

export default App;
