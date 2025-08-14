import { axiosClient } from './axiosClient';

// export const fetchMatches = async () => {
//   const response = await axiosClient.get('/matches');
//   return response.data;
// };

export const fetchMatches = async () => {
  await new Promise((res) => setTimeout(res, 1000)); // Simulate API delay
  return [
    { id: '1', name: 'Match One' },
    { id: '2', name: 'Match Two' },
    { id: '3', name: 'Match three' },
    { id: '4', name: 'Match Four' },
    { id: '5', name: 'Match Five' },
    { id: '6', name: 'Match Six' },
    { id: '7', name: 'Match Seven' },
    { id: '8', name: 'Match Eight' },
    { id: '9', name: 'Match Nine' },
    { id: '10', name: 'Match Ten' },
  ];
};
