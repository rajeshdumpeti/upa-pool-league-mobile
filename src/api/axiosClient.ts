// import axios from 'axios';

// export const axiosClient = axios.create({
//   baseURL: 'https://api.example.com',  // Replace with real API later
//   timeout: 5000,
// });


// src/api/axiosClient.ts
import axios from 'axios';

// For iOS Simulator or web: 'http://localhost:8000'
// For Android Emulator: 'http://10.0.2.2:8000'
export const axiosClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 5000,
});