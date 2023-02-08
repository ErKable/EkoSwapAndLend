import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from "./components/Navbar/Nav"
import Homepage from './pages/Homepage'
import Ekoswap from './pages/EkoSwap/Ekoswap'
import Ekolend from './pages/Ekolend/Ekolend';
import Exchange from './pages/Exchange/Exchange';

function App() {




  return (

    <div className= 'bg-white dark:bg-black transition duration-300 text-primary dark:text-secondary-light h-screen'>

      <Router>

        <Navbar/>

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