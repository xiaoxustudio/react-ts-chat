import { GetProp, UploadProps } from 'antd';

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const encodeText = (text: string) => {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(text);
    const buffer = uint8Array.buffer;
    return buffer;
};
export const decodeText = (buffer: ArrayBuffer): string => {
    const decoder = new TextDecoder();
    const uint8Array = new Uint8Array(buffer);
    const text = decoder.decode(uint8Array);
    return text;
};
