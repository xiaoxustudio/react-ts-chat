import { ButtonProps, Flex, FlexProps } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface ToolIconProp extends Omit<FlexProps, 'children'> {
    icon: ReactNode;
    onClick: ButtonProps['onClick'];
}
function ToolIcon({ icon, ...reset }: ToolIconProp) {
    return (
        <Flex
            {...reset}
            role="button"
            tabIndex={0}
            align="center"
            className={classNames(
                'ToolIcon block cursor-pointer rounded-md p-1 text-gray-700 transition-colors hover:bg-gray-200',
                reset.className,
            )}
        >
            {icon}
        </Flex>
    );
}
export default ToolIcon;
