import { create } from 'zustand';
import { Problem } from '../../utils/types';

interface ProblemSlice {
  problems: Problem[];
  setProblems: (problems: Problem[]) => void;
}

export const useProblemSlice = create<ProblemSlice>()((set) => ({
  problems: [],
  setProblems: (problems) => set(() => ({ problems })),
}));

// import { create } from 'zustand';
// import axios from 'axios';
// import { Problem } from '../../utils/types';

// interface ProblemSlice {
//   problems: Problem[];
//   fetchProblems: () => Promise<void>;
// }

// export const useProblemSlice = create<ProblemSlice>()((set) => ({
//   problems: [],
//   fetchProblems: async () => {
//     try {
//       console.log('fetching problems', import.meta.env.VITE_API_BASE_URL);
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/problems`);
//       set({ problems: response.data });
//     } catch (error) {
//       console.error('Error fetching problems:', error);
//     }
//   },
// }));
