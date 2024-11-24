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
	CreateChannel,
	DisConnectChannel,
	UpdateMsgList,
}

export const wsUrl = "http://localhost:8000/imc"; // imc地址
