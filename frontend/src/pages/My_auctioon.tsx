import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Getauction } from '../graphql/Queries';
import { useNavigate } from 'react-router-dom';
export const My_auctioon: React.FC = () => {
    const navigate=useNavigate();
    const [response, setResponse] = useState<any>([]); // Initialize as an empty array
    const { error, loading, data } = useQuery(Getauction, {
        variables: {
            of: "my", // Example variable; ensure it matches your query requirements
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
            {response.map((auction: any, index: number) => (
                <div key={index}>
                    <p>Item Name: {auction.itemName}</p>
                    <p>End Date: {new Date(auction.endDate).toLocaleString()}</p>
                    {auction.cloudinaryImageLink && (
                        <img src={auction.cloudinaryImageLink} alt={`Auction ${index}`} style={{ width: '200px', height: 'auto' }} />
                    )}
                            <button onClick={() => {



navigate('/bid', { state: { auction: auction } })
}} >view bid</button>
</div>                
            ))}
        </div>
    );
};
