export enum RepCode {
    Fail,
    Success,
    // 表单错误
    DataEmpty = 100,
    // token错误
    TokenEmpty = 200,
    TokenInValid = 201,
    TokenExpired = 202,
}

export enum WsCode {
    HeartBeat = 801,
    HeartBeatServer,
    HeartBeatClient,
    Receive,
    Send,
    WithDraw,
    CreateChannel,
    DisConnectChannel,
    UpdateMsgList,
}

/* 静态界面默认样式 */

export const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
};
export const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    height: 500,
};

export const headerStyle: React.CSSProperties = {
    height: 64,
    lineHeight: '64px',
    backgroundColor: '#fff',
};

// 允许的上传文件类型
export const AllowFileType = Object.keys({
    'image/png': true,
    'image/jpeg': true,
    'image/jpg': true,
});

export const ServerUrl = 'http://localhost:8000'; // 服务器地址
export const wsUrl = `${ServerUrl}/imc`; // imc地址
export const wsUrlGroup = `${ServerUrl}/gimc`; // 群组 imc地址
