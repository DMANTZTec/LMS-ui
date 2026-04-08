import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import AppRoute from './route/AppRoute';
import './App.css'

const queryClient = new QueryClient();

function App() {

  return (
<QueryClientProvider client={queryClient}>
    <AppRoute/>
</QueryClientProvider>
  );
}

export default App
