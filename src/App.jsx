import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import AppRoute from './route/AppRoute';
import './App.css'
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();


function App() {

  return (
<QueryClientProvider client={queryClient}>
  <Toaster position="top-right" />
    <AppRoute/>
</QueryClientProvider>
  );
}

export default App
