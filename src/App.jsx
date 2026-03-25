
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './features/Test'

import './App.css'


function App() {
  
  return (
    <>
      
    <BrowserRouter>
    <Routes>
      <Route path="test" element={<Test/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
