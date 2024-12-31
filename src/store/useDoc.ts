import { DocItemData } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HeaderProp {
    select: DocItemData;
    setSelect: (_un: DocItemData) => void;
    reset: () => void;
}

const useDoc = create<HeaderProp>()(
    persist(
        (set) => ({
            select: {} as unknown as DocItemData,
            setSelect: (newVal) => set({ select: newVal }),
            reset: () => set({ select: {} as unknown as DocItemData }),
        }),
        {
            name: 'doc',
        },
    ),
);
export default useDoc;
