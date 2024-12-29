import { ServerUrl } from '@/consts';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, AvatarProps } from 'antd';

interface AvatarIconProp extends AvatarProps {
    url?: string;
}
function AvatarIcon(prop: AvatarIconProp) {
    const { url, ...reset } = prop;
    return (
        <Avatar
            {...reset}
            size={reset.size ?? 'large'}
            icon={!url && <UserOutlined />}
            src={`${ServerUrl}${url?.slice(1)}`}
        />
    );
}
export default AvatarIcon;
