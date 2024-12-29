import { Button, Flex, Layout } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { layoutStyle, headerStyle, contentStyle } from '@/consts';
import { Header, Content } from 'antd/es/layout/layout';
import classNames from 'classnames';
import style from './token.module.less';

function TokenVerify() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const token_id = useMemo(() => (params ? params.get('token') : ''), [params]);
    return (
        <Flex gap="middle" wrap>
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
                    <Button onClick={handleBack}>返回上一页</Button>
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
