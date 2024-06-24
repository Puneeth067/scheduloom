import { create } from "zustand";

interface SelectedIdsStore {
    selectedIds: string[];
    toggleSelectedId: (id: string) => void;
}
// todo: add proper types
const useSelectedIdsStore = create<SelectedIdsStore>((set: any) => ({
    selectedIds: [],
    toggleSelectedId: (id: string) =>
        set((state: any) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId: string) => selectedId !== id)
                : [...state.selectedIds, id],
        })),
}));

export default useSelectedIdsStore;
