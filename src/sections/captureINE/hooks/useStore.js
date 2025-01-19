import { create } from 'zustand';

const useStore = create((set) => ({
  activeComponent: false,
  setActiveComponent: (isValue) => set({ activeComponent: isValue }),
  dataINE: null,
  setDataINE: (state) => set({ dataINE: state }),
  isLoading: false,
  setIsLoading: (isValue) => set({ isLoading: isValue }),
  isError: false,
  setIsError: (isValue) => set({ isError: isValue }),
}));

export default useStore;
