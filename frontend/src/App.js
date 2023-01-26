import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from "./components/Navbar"
import Homepage from './pages/Homepage'
import Ekoswap from './pages/Ekoswap'
import Ekolend from './pages/Ekolend';
import Exchange from './pages/Exchange';

function App() {

  return (

    <div>

      <Navbar/>

      <Router>

        <Routes>

        <Route path='/' element={<Homepage/>} />

        <Route path='/ekoswap' element={<Ekoswap/>} />

        <Route path='/ekolend' element={<Ekolend/>} />

        <Route path='/exchange' element={<Exchange/>} />

        </Routes>

      </Router>

    </div>

  )
}


export default App