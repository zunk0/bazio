import React from 'react';

export default function DbError() {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <div className="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-700">Failed to connect to db</h3>
      <p className="text-gray-500 mt-2">There was a problem connecting to the database. Please check your connection and try again later.</p>
    </div>
  );
}
