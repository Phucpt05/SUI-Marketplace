import { create } from "zustand";

export type ModalContent = React.ReactNode;

export interface ModalState {
    isOpen: boolean;
    title?: string;
    content?: ModalContent;
    open: (params?: { title?: string; content?: ModalContent }) => void;
    close: () => void;
    setContent: (content?: ModalContent) => void;
}

export const useModalStore = create<ModalState>(set => ({
    isOpen: false,
    title: undefined,
    content: undefined,
    open: params =>
        set({
            isOpen: true,
            title: params?.title,
            content: params?.content,
        }),
    close: () => set({ isOpen: false, title: undefined, content: undefined }),
    setContent: content => set({ content }),
}));


