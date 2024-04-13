import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import {useSelector} from 'react-redux'
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  console.log(listing);

  const {currentUser} = useSelector((state)=> state.user)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${params.listingId}`);

        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && (
        <p className="absolute top-2/4 left-2/4 ">
          <AiOutlineLoading3Quarters size={50} className="animate-spin" />
        </p>
      )}
      {
        /* {error && (
        <p className="font-semibold text-4xl absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
          Something Went Wrong!
        </p>
      )} */
        error && navigate("/")
      }
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[1%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4 sm:p-[20px]">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-700 w-full max-w-[200px] text-center p-1 rounded-md text-white">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-700 w-full max-w-[200px] text-center p-1 rounded-md text-white">
                  ${+listing.regularPrice - +listing.discountPrice} Off
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-700 font-semibold text-sm flex gap-3 flex-wrap">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Baths`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {
              currentUser && listing.userRef !== currentUser._id && !contact &&(
                <button onClick={()=>setContact(true)} className="uppercase bg-slate-700 text-white p-3 rounded-md mt-2 hover:opacity-95">Contact Landlord</button>
              )
            }
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}
