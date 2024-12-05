import { create } from 'zustand';

const useStore = create((set) => ({
  activeComponent: false,
  setActiveComponent: (isValue) => set({ activeComponent: isValue }),
  
 
}));

export default useStore;
