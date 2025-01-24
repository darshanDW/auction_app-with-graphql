
import React, { Children } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Create_auction from './pages/Create_auction';
import { ALl_auction } from './pages/ALl_auction';
import { My_auctioon } from './pages/My_auctioon';
import NavBar from './component/NavBar';
import { Bid } from './pages/Bid'; 
function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='create' element={<Create_auction />} />
          <Route path='all_auction' element={<ALl_auction />} />
          <Route path='My_auction' element={<My_auctioon />} />
<Route path='bid' element={<Bid/>}/>


        </Routes>
      </BrowserRouter></>
  );  
}

export default App;
