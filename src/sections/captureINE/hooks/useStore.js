import { create } from 'zustand';

const useStore = create((set) => ({
  activeComponent: false,
  setActiveComponent: (isValue) => set({ activeComponent: isValue }),
  dataINE: null,
  setDataINE: (state) => set({ dataINE: state }),
}));

export default useStore;
