import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice'
import Oauth from "../components/Oauth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading,error} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
     dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data))
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-5">
      <h1 className="underline text-3xl text-center font-semibold mb-6">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Loading..." : "Sign In"}
        </button>
        <Oauth/>
      </form>
      <div className="flex justify-center mt-5 text-sm text-gray-600">
        <p>Dont have an account? </p>
        <Link
          to="/sign-up"
          className="text-blue-500 ml-1 hover:underline focus:outline-none"
        >
          Sign Up
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
