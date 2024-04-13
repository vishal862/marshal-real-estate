import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMoreButton(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMoreButton(true);
      } else {
        setShowMoreButton(false);
      }
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const handleShowMoreListings = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMoreButton(false);
    }
    setListing([...listing, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              className="border p-3"
              placeholder="Search..."
              type="text"
              id="searchTerm"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                id="all"
                className="w-5"
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                id="rent"
                className="w-5"
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                id="sell"
                className="w-5"
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.type === "sell"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                id="offer"
                className="w-5"
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                id="parking"
                className="w-5"
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                id="furnished"
                className="w-5"
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Sort:</label>
            <div className="flex gap-2">
              <select
                onChange={handleChange}
                defaultValue={"created_at_desc"}
                id="sort_order"
                className="p-3 border rounded-md"
              >
                <option value="regularPrice_desc">Price High to Low</option>
                <option value="regularPrice_asc">Price Low to High</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>
          <button className="bg-blue-500 text-white p-3 rounded-md uppercase text-center hover:bg-blue-600">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="mt-5 text-3xl font-semibold border-b p-3 text-gray-800">
          Listing Results:
        </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {!loading && listing.length === 0 && (
            <p className="text-center p-5 text-3xl font-semibold text-gray-800">
              No Listings Found!
            </p>
          )}
          {loading && (
            <div className="w-full flex justify-center">
              <AiOutlineLoading3Quarters
                size={50}
                className="animate-spin text-blue-500"
              />
            </div>
          )}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMoreButton && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={handleShowMoreListings}
            >
              Show More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
