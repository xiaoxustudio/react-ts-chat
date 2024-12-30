import { Button, Flex, Layout, message } from 'antd';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { layoutStyle, headerStyle, contentStyle, RepCode } from '@/consts';
import { Header, Content } from 'antd/es/layout/layout';
import classNames from 'classnames';
import style from './token.module.less';
import ValidEmail from '@/apis/user/valid-email';

function TokenVerify() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const handleBack = () => navigate('/');
    const token_id = useMemo(() => (params ? params.get('token') : ''), [params]);
    const user_id = useMemo(() => (params ? params.get('user') : ''), [params]);
    useEffect(() => {
        ValidEmail({ code: token_id!, user: user_id! }).then((data) => {
            if (data.code === RepCode.Success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
            handleBack();
        });
    }, []); //eslint-disable-line
    return (
        <Flex gap="middle" wrap>
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
                    <Button onClick={handleBack}>返回</Button>
                </Header>
                <Content style={contentStyle}>
                    <Flex className={classNames(style.TokenBox, 'justify-center')}>
                        验证码：<span className={classNames(style.text)}>{token_id}</span>
                    </Flex>
                </Content>
            </Layout>
        </Flex>
    );
}
export default TokenVerify;
