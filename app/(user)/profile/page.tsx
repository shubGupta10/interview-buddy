"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  isAdmin: boolean;
  profileImage: string;
}

export default function ProfilePage() {
  const session = useSession();
  const userId = session.data?.user.id;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
        setFormData({
          name: data.user.name,
          email: data.user.email,
        });
      } catch (err) {
        setError("Error fetching user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await fetch("/api/user/edit-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: formData.name,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      
      setCurrentUser((prev) => prev ? { ...prev, ...formData } : null);
      
      setUpdateMessage({ 
        type: "success", 
        message: "Profile updated successfully" 
      });
      
      setTimeout(() => {
        setOpenDialog(false);
        setUpdateMessage(null);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setUpdateMessage({ 
        type: "error", 
        message: "Failed to update profile" 
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[#FF9F1C] font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-transparent">
      <div className="bg-transparent text-[#D1D7E0] shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <div className="relative mx-auto w-28 h-28 rounded-full mb-6 overflow-hidden border-4 border-[#FF2A6D]">
          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#9D4EDD] text-white text-4xl font-bold">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-[#FF2A6D] to-[#9D4EDD] bg-clip-text">
          {currentUser?.name}'s Profile
        </h1>

        <div className="mt-6 text-white space-y-4">
          <div className="bg-[#231651] p-4 rounded-md border border-[#9D4EDD]/20">
            <p className="flex justify-between">
              <span className="text-[#05FFF8]">Email:</span> 
              <span>{currentUser?.email}</span>
            </p>
          </div>

          {/* <div className="bg-[#231651] p-4 rounded-md border border-[#9D4EDD]/20">
            <p className="flex justify-between">
              <span className="text-[#05FFF8]">Provider:</span> 
              <span className="capitalize">{currentUser?.provider}</span>
            </p>
          </div> */}

          <div className="bg-[#231651] p-4 rounded-md border border-[#9D4EDD]/20">
            <p className="flex justify-between">
              <span className="text-[#05FFF8]">Role:</span> 
              <span>{currentUser?.isAdmin ? "Admin" : "User"}</span>
            </p>
          </div>
        </div>

        {/* Edit Profile Button - Only show for credential provider */}
        {currentUser?.provider === "credentials" && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger className="cursor-pointer" asChild>
              <Button 
                className="mt-8 bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#231651] border border-[#FF2A6D] text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center font-bold bg-gradient-to-r from-[#FF2A6D] to-[#9D4EDD] bg-clip-text text-transparent">
                  Edit Your Profile
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#05FFF8]">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#1A1040] border-[#9D4EDD] focus:border-[#FF2A6D] text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#05FFF8]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#1A1040] border-[#9D4EDD] focus:border-[#FF2A6D] text-white"
                    required
                  />
                </div>
                
                {updateMessage && (
                  <div 
                    className={`p-3 rounded text-center ${
                      updateMessage.type === "success" 
                        ? "bg-[#05FFF8]/20 text-[#05FFF8]" 
                        : "bg-[#FF9F1C]/20 text-[#FF9F1C]"
                    }`}
                  >
                    {updateMessage.message}
                  </div>
                )}
                
                <Button 
                  type="submit"
                  disabled={updating}
                  className="w-full bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 text-white py-2 px-4 rounded-md transition-all duration-300 cursor-pointer"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}