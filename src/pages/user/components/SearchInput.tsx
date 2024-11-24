import { Dropdown, Input } from "antd";
import { SearchInputProps } from "@/types";
import { FC } from "react";
const SearchInput: FC<SearchInputProps> = (prop: SearchInputProps) => {
	return (
		<>
			<Dropdown
				menu={prop.options}
				placement="bottomLeft"
				open={prop.open || false}
			>
				<Input placeholder={prop.placeholder} onChange={prop.onChange} />
			</Dropdown>
		</>
	);
};
export default SearchInput;
