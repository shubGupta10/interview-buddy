"use client";

import useAuthStore from "@/app/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface Company {
    id: string;
    companyName: string;
  }
  

function Dashboard() {
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { user } = useAuthStore();
  const session = useSession();
  const userId = session.data?.user.id;
  const router = useRouter()

  useEffect(() => {
    if (!userId) return; 

    const fetchAllCompanies = async () => {
      try {
        const response = await fetch(`${backendUrl}/company/fetch-companies?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch companies");

        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchAllCompanies();
  }, [userId]); 


  const handleAddCompany = async () => {
    if (!companyName.trim()) return alert("Company name cannot be empty!");

    try {
      const response = await fetch(`${backendUrl}/company/create-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, companyName }),
      });

      if (!response.ok) throw new Error("Failed to create company");

      const newCompany = await response.json();
      setCompanies((prev) => [...prev, newCompany]); 
      setCompanyName(""); 
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen p-5">
      {/* Header */}
      <div className="text-center text-4xl font-semibold mb-8">
        Welcome to InterviewBuddy, <span className="text-blue-600">{user?.name}</span>
      </div>

      {/* Create Company Section */}
      <div className="flex justify-center items-center mb-6">
        <Dialog>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
            + Create Company
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Company</DialogTitle>
              <DialogDescription>
                <div className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddCompany} className="bg-green-600 hover:bg-green-700">
                      Add Company
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Companies */}
      <div className="max-w-2xl mx-auto">
        {companies.length > 0 ? (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg shadow-md bg-transparent">
                <h2 className="text-lg font-medium">{company.companyName}</h2>
                <h2 className="text-lg font-medium">{company.id}</h2>
                <Button className="cursor-pointer" onClick={() => { router.push(`/dashboard/rounds?companyId=${company.id}`) }}>Open</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No companies found. Create one above!</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
