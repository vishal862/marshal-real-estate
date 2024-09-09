import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`); // Corrected URL format
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  // Ensure landlord and listing are loaded before constructing the mailto link
  const mailtoLink = landlord
    ? `mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${encodeURIComponent(
        message
      )}`
    : "#";

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-md p-3 border-slate-800"
            placeholder="Enter Your Message Here..."
          />
          <a
            href={mailtoLink}
            className="uppercase bg-slate-700 rounded-md p-3 w-full text-white text-center"
          >
            send message
          </a>
        </div>
      )}
    </>
  );
}
