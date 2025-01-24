import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Getauction } from '../graphql/Queries';
import { useNavigate } from 'react-router-dom';
import { jwtDecodeded } from './Bid';
import { jwtDecode } from 'jwt-decode';


export interface Auction {
  id: string,
  itemName: string,
  endDate: string,
  cloudinaryImageLink: string
}

export interface Auction {
  id: string,
  itemName: string,
  endDate: string,
  cloudinaryImageLink: string
  creatorId:string
}

export const ALl_auction: React.FC = () => {
  const token=localStorage.getItem('authToken')
  let userid:string=""
  if(token)
{  const decoded :jwtDecodeded= jwtDecode(token);
 userid=decoded.id;
console.log(userid)}

  const navigate = useNavigate();
  const [response, setResponse] = useState<any>([]); // Initialize as an empty array
  const { error, loading, data } = useQuery(Getauction, {
    variables: {
      of: "all", // Example variable; ensure it matches your query requirements
    },
  });

  useEffect(() => {
    if (data && data.Getauctions && data.Getauctions.auctions) {
      setResponse(data.Getauctions.auctions);
      
    }
  }, [data]);

  if (loading) return <p>Loading auctions...</p>;
  if (error) return <p>Error fetching auctions: {error.message}</p>;

  return (
    <div>
      {response.map((auction: Auction, index: number) => (
        <div key={index}>
          <p>Item Name: {auction.itemName}</p>
          <p>{auction.id}</p>
          <p>End Date: {new Date(auction.endDate).toLocaleString()}</p>
          {auction.cloudinaryImageLink && (
            <img src={auction.cloudinaryImageLink} alt={`Auction ${index}`} style={{ width: '200px', height: 'auto' }} />
          )
          }

          <button onClick={() => {



            navigate('/bid', { state: { auction: auction } })
          }} >{auction.creatorId!=userid && new Date(auction.endDate).getTime() > Date.now() ? 'place bid' : 'view bid'}</button>
        </div>
      ))}
    </div>
  );
};
