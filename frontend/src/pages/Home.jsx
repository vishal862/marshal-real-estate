import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sell&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className=" flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 lg:text-6xl">
          Find your next <span className="text-gray-500">perfect</span>
          <br />
          Place with ease
        </h1>
        <div className="text-gray-400">
          Marshal Estate is the best place to find your next perfect place to
          Live.
          <br />
          We have a range of properties for you to choose from.
        </div>
        <Link to={"/search"} className="text-blue-600 hover:underline">
          Let's get Started...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                key={listing._id}
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* offers and all */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {
            offerListings && offerListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-gray-700">Recent Offers</h2>
                  <Link className="text-blue-500 hover:underline text-sm" to={'/search?offer=true'}>See more Offers...</Link>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {
                    offerListings.map((listing)=>(
                      <ListingItem listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            rentListings && rentListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-gray-700">Recent Rentals</h2>
                  <Link className="text-blue-500 hover:underline text-sm" to={'/search?type=rent'}>See Rental Houses...</Link>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {
                    rentListings.map((listing)=>(
                      <ListingItem listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            saleListings && saleListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-gray-700">Recent Places for Sales</h2>
                  <Link className="text-blue-500 hover:underline text-sm" to={'/search?type=sell'}>See more Places for sale...</Link>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {
                    saleListings.map((listing)=>(
                      <ListingItem listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
              </div>
            )
          }
      </div>
    </div>
  );
}
