import { PropsWithChildren, Suspense } from 'react';
import { Spin } from 'antd';

const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const content = <div style={contentStyle} />; // 加载遮罩

interface LoadingProp {
    loading?: boolean;
}

function Loading({ children, loading }: PropsWithChildren<LoadingProp>) {
    return (
        <Suspense
            fallback={
                <Spin tip="Loading" size="large" spinning={loading}>
                    {content}
                </Spin>
            }
        >
            {children}
        </Suspense>
    );
}

export default Loading;
