"use client";

import React, { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  isAdmin: boolean;
  profileImage: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setCurrentUser(data.user);
      } catch (err) {
        setError("Error fetching user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-transparent text-white border-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        {currentUser?.profileImage && (
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-white"
          />
        )}
        <h1 className="text-2xl font-bold mt-4">{currentUser?.name}'s Profile</h1>

        <div className="mt-4 text-white">
          <p>
            <strong>Email:</strong> {currentUser?.email}
          </p>
          <p>
            <strong>Provider:</strong> {currentUser?.provider}
          </p>
          <p>
            <strong>Role:</strong> {currentUser?.isAdmin ? "Admin" : "User"}
          </p>
        </div>
      </div>
    </div>
  );
}
