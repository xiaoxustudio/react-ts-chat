import { Outlet } from "react-router";
import Lodding from "./pages/Lodding";
import HeaderMenu from "./components/Header";

function App() {
	return (
		<>
			<div style={{ width: "100vw", height: "100vh" }}>
				<HeaderMenu></HeaderMenu>
				<Lodding children={<Outlet />}></Lodding>
			</div>
		</>
	);
}

export default App;
