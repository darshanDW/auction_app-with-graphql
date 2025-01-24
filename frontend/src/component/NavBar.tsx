import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#f8f9fa' }}>
      <Link to="create">Create Auction</Link>
      <Link to="all_auction">All Auctions</Link>
      <Link to="my_auction">My Auctions</Link>
    </nav>
  );
};

export default NavBar;  
