import { useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlaceBid } from '../graphql/Mutation';
import { LATEST_BIDS_SUBSCRIPTION } from '../graphql/Subscription';
import { GEtbids } from '../graphql/Queries';
import { jwtDecode } from 'jwt-decode';
export interface jwtDecodeded {

id:string



}
export const Bid = () => {
      const token=localStorage.getItem('authToken')
      let userid:string=""
      if(token)
    {  const decoded:jwtDecodeded = jwtDecode(token);
     userid=decoded.id;
    console.log(userid)}
    const location = useLocation();
    const auction = location.state?.auction || {};
    const [latest_bids, setLatest_bids] = useState<any[]>([]);
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [placeBid] = useMutation(PlaceBid);

    const { data: bidsData } = useSubscription(LATEST_BIDS_SUBSCRIPTION, {
        variables: { auctionId: auction?.id },
        skip: !auction?.id,
    });

    const { data: bids } = useQuery(GEtbids, {
        variables: { auctionId: auction?.id },
        skip: !auction?.id,
    });

    useEffect(() => {
        if (bids?.GetBids) {
            setLatest_bids(bids.GetBids);
        }
    }, [bids]);

    useEffect(() => {
        if (bidsData?.latestBids) {
            setLatest_bids(bidsData.latestBids);
        }
    }, [bidsData]);

    const Place = async () => {
        try {
            setIsPlacingBid(true);
            setErrorMessage("");
            await placeBid({
                variables: {
                    auctionId: auction.id,
                    amount: 10,
                },
            });
        } catch (error) {
            console.error("Error placing bid:", error);
            setErrorMessage("Failed to place bid. Please try again.");
        } finally {
            setIsPlacingBid(false);
        }
    };
    console.log(new Date(auction.endDate).getTime()>Date.now())     
console.log( Date.now())

    return (
        <div>
            <img
                src={auction.cloudinaryImageLink || '/fallback-image.png'}
                alt="Auction Image"
                onError={(e) => (e.currentTarget.src = '/fallback-image.png')}
                style={{ objectFit: 'cover', width: '100px', height: 'auto' }}
            />
            <div>
                <div>
                    <p>{auction.itemName}</p>
                    <p>{`End Date: ${new Date(auction.endDate).toLocaleString()}`}</p>
                    <p>{`Current Price: Rs ${auction.currentPrice}`}</p>
                </div>
                <p>
                    {Array.isArray(latest_bids) && latest_bids.length > 0 && new Date(auction.endDate).getTime() > Date.now()
                        ? `winning ${latest_bids[0]?.user?.firstName || 'unknown'}`
                        : `winner ${latest_bids[0]?.user?.firstName || 'unknown'}`}
                </p>
                {latest_bids.length > 0 ? (
                    latest_bids.map((bid: any, index: number) => (
                        <div key={index}>
                            <p>{`Rs ${bid.amount} by ${bid.user?.firstName || 'Anonymous'} before ${new Date(
                                bid.createdAt
                            ).toLocaleString()}`}</p>
                        </div>
                    ))
                ) : (
                    <p>No bids available.</p>
                )}
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
           {auction.creatorId!=userid && new Date(auction.endDate).getTime() > Date.now() && <button
                onClick={Place}
                disabled={isPlacingBid}
                style={{
                    cursor: isPlacingBid ? 'not-allowed' : 'pointer',
                    opacity: isPlacingBid ? 0.7 : 1,
                }}
            >
                {   isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
            </button>}
        </div>
    );
};
