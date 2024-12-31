import { WsData } from '@/types';
import { encodeText } from '@/utils';

function useSend() {
    return {
        sendWrapper: (s: WsData) => JSON.stringify(s),
        sendDocWrapper: (s: WsData) => encodeText(JSON.stringify(s)),
    };
}
export default useSend;
