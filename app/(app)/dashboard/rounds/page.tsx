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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CompanyRounds() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const session = useSession();
  const userId = session.data?.user?.id;
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");

  const [rounds, setRounds] = useState<{ id: any; roundName: string }[]>([]);
  const [roundName, setRoundName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
  }, [companyId]);


  const handleAddRound = async () => {
    if (!roundName || !companyId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${backendUrl}/company/create-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, roundName }),
      });

      if (!response.ok) throw new Error("Failed to add round");

      const data = await response.json();
      const newRound = { id: data.roundId, roundName };

      setRounds([...rounds, newRound]); 
      setRoundName(""); 
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

      {/* ✅ Show Existing Rounds */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500">Loading rounds...</p>
        ) : rounds.length > 0 ? (
          <ul className="list-disc pl-5">
            {rounds.map((round) => (
              <div key={round.id} className="text-lg h-auto w-auto">
                {round.roundName}
                <Button onClick={() => {router.push(`/dashboard/rounds/generate-question?companyId=${companyId}&roundId=${round.id}&roundName=${round.roundName}`)}}>click to open this round</Button>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No rounds added yet.</p>
        )}
      </div>

      {/* ✅ Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* ✅ Add Round Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-blue-600 text-white">Add Round</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Round</DialogTitle>
            <DialogDescription>
              <Label className="block mt-2">Round Name</Label>
              <Input
                type="text"
                placeholder="Enter round name"
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                className="mt-1 p-2 border rounded"
              />
              <Button onClick={handleAddRound} className="mt-4" disabled={loading}>
                {loading ? "Adding..." : "Add Round"}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
