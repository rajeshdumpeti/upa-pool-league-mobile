import { create } from 'zustand';

type Match = {
  id: string;
  name: string;
  team1Score?: number;
  team2Score?: number;
};

type MatchStore = {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  updateMatchScore: (id: string, team1Score: number, team2Score: number) => void;
};

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  setMatches: (matches) => set({ matches }),
  updateMatchScore: (id, team1Score, team2Score) =>
    set((state) => ({
      matches: state.matches.map((match) =>
        match.id === id ? { ...match, team1Score, team2Score } : match
      ),
    })),
}));
