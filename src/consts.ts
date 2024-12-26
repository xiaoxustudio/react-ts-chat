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

// 允许的上传文件类型
export const AllowFileType = Object.keys({
    'image/png': true,
    'image/jpeg': true,
    'image/jpg': true,
});

export const ServerUrl = 'http://localhost:8000'; // 服务器地址
export const wsUrl = `${ServerUrl}/imc`; // imc地址
export const wsUrlGroup = `${ServerUrl}/gimc`; // 群组 imc地址
