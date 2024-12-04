import { create } from 'zustand';

const useStore = create((set) => ({
  value: null,
  setValue: (isValue) => set({ value: isValue }),
  
 
}));

export default useStore;
