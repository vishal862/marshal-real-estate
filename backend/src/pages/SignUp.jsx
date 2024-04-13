import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      //...formData : a spread op is used to keep the track of the original object ex. if we didn't write ...formData then while filling the form it wont' keep track of previous filed if we fill username and then try to fill email then it won't keep the track of username it will just remember email so for that reason we use ...frormData
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-5">
      <h1 className="underline text-3xl text-center font-semibold mb-6">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          onChange={handleChange}
          className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-slate-700"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-slate-700"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-slate-700"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 focus:outline-none"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <Oauth/>
      </form>
      <div className="flex justify-center mt-5 text-sm text-gray-600">
        <p>Already have an account? </p>
        <Link
          to="/sign-in"
          className="text-blue-500 ml-1 hover:underline focus:outline-none"
        >
          Sign In
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
