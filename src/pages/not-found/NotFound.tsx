import { Button, Flex, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useLocation, useNavigate } from 'react-router';
import { layoutStyle, headerStyle, contentStyle } from '@/consts';
import stylesFound from './not-found.module.less';

function NotFound() {
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const loc = useLocation();
    return (
        <>
            <Flex gap="middle" wrap>
                <Layout style={layoutStyle}>
                    <Header style={headerStyle}>
                        <Button onClick={handleBack}>返回上一页</Button>
                    </Header>
                    <Content style={contentStyle}>
                        <div className={stylesFound['not-found']}>
                            404
                            <div className={stylesFound['sub-found']}>
                                未找到页面：{loc.pathname}
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Flex>
        </>
    );
}

export default NotFound;
