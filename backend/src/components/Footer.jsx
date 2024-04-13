import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-5">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-gray-400">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-400">About</Link>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
          <ul className="flex justify-center gap-4">
            <li>
              <a href="#" className="hover:text-gray-400">
                <FaFacebook className="text-3xl" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                <FaTwitter className="text-3xl" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                <FaInstagram className="text-3xl" />
              </a>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
          <p className="mb-2">Vashi near Raghu leela Mall</p>
          <p className="mb-2">Mumbai, Maharashtra, India</p>
          <p className="mb-2">Email: info@marshal.com</p>
          <p>Phone: +1234567890</p>
        </div>
      </div>
      <div className="mt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Marshal Estate. All rights reserved.</p>
        <p>"Discover your dream home with Marshal Estate."</p>
      </div>
    </div>
  </footer>
  )
}
