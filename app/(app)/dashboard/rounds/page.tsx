"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompanyRounds() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const session = useSession();
  const userId = session.data?.user?.id;
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");

  const [rounds, setRounds] = useState<{ id: any; roundName: string }[]>([]);
  const [selectedRound, setSelectedRound] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Predefined round options
  const roundOptions = [
    { value: "Technical Interview", label: "Technical Interview" },
    { value: "Machine Coding", label: "Machine Coding" },
    { value: "Behavioral Interview", label: "Behavioral Interview" },
    { value: "System Design", label: "System Design" },
    { value: "HR Round", label: "HR Round" },
    { value: "Managerial Round", label: "Managerial Round" },
  ];

  useEffect(() => {
    if (!companyId) return;

    const fetchRounds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/company/fetch-rounds?companyId=${companyId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch rounds");

        const data = await response.json();
        setRounds(data.rounds || []);
      } catch (error) {
        console.error("Error fetching rounds:", error);
        setError("Failed to load rounds.");
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, [companyId, backendUrl]);

  const handleAddRound = async () => {
    if (!selectedRound || !companyId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${backendUrl}/company/create-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, roundName: selectedRound }),
      });

      if (!response.ok) throw new Error("Failed to add round");

      const data = await response.json();
      const newRound = { id: data.roundId, roundName: selectedRound };

      setRounds([...rounds, newRound]); 
      setSelectedRound(""); 
    } catch (error) {
      console.error("Error adding round:", error);
      setError("Failed to add round.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5">
      <h1 className="text-3xl font-semibold">Company Rounds</h1>

      {/* Show Existing Rounds */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500">Loading rounds...</p>
        ) : rounds.length > 0 ? (
          <div className="space-y-4">
            {rounds.map((round) => (
              <div key={round.id} className="flex items-center justify-between p-4 text-black bg-gray-100 rounded-lg">
                <span className="text-lg font-medium">{round.roundName}</span>
                <Button 
                  onClick={() => {
                    router.push(`/dashboard/rounds/generate-question?companyId=${companyId}&roundId=${round.id}&roundName=${round.roundName}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Open Round
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No rounds added yet.</p>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Add Round Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Add Round</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Round</DialogTitle>
            <DialogDescription>
              <div className="mt-4">
                <Label htmlFor="round-select" className="block mb-2">Select Round Type</Label>
                <Select value={selectedRound} onValueChange={setSelectedRound}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a round type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roundOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleAddRound} 
                  className="mt-4 w-full" 
                  disabled={loading || !selectedRound}
                >
                  {loading ? "Adding..." : "Add Round"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}