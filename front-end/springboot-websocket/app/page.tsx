"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function App() {
  const [id, setId] = useState("");
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col container mx-auto gap-2">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Write your{" "}
        <mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">
          #nickname
        </mark>
      </h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        This application was made with spring boot and react.
      </p>
      <div>
      
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </div>

      <Link
        href={id ? `/chat/chatlist/${encodeURIComponent(id)}` : "#"}
        aria-disabled={!id}
        className={`inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 ${
          id ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-400 pointer-events-none opacity-60"
        }`}
      >
       Go
        <svg
          className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </Link>
    </div>
  );
}
