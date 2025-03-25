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
  DialogFooter,
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
import { PlusCircle, Loader2, ChevronRight, AlertCircle, History, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function CompanyRounds() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const session = useSession();
  const userId = session.data?.user?.id;
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const router = useRouter();

  const [rounds, setRounds] = useState<{ id: any; roundName: string }[]>([]);
  const [selectedRound, setSelectedRound] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("Company");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roundToDelete, setRoundToDelete] = useState<{ id: string, name: string } | null>(null);

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
  
    const fetchCompanyData = async () => {
      const toastId = toast.loading("Fetching company rounds...");
  
      try {
        setLoading(true);
  
        const companyResponse = await fetch(`${backendUrl}/company/fetch-companies?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "Cache-Control": "max-age=300"  },
          cache: "default" 
        })
  
        if (companyResponse.ok) {
          const companyData = await companyResponse.json();
          setCompanyName(companyData.company?.companyName || "Company");
        }
  
        const roundsResponse = await fetch(`${backendUrl}/company/fetch-rounds?companyId=${companyId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "Cache-Control": "max-age=300"  },
          cache: "default"
        });
  
        if (!roundsResponse.ok) throw new Error("Failed to fetch rounds");
  
        const data = await roundsResponse.json();
        setRounds(data.rounds || []);
  
        toast.success("Successfully fetched interview rounds!", { id: toastId });
      } catch (error) {
        toast("Warning: Can't able to fetch rounds, Try to create a new!", {
          id: toastId,
          icon: <AlertTriangle className="text-yellow-500 w-5 h-5" />, 
          style: {
            background: "#fef3c7", 
            color: "#92400e",
            border: "1px solid #fbbf24",
          },
        });
        console.error("Error fetching data:", error);
        setError("Failed to load interview rounds.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanyData();
  }, [companyId, backendUrl, userId]);
  

  const handleAddRound = async () => {
    if (!selectedRound || !companyId) return;
    const toastId = toast.loading("Adding new interview round...");
  
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
      setIsDialogOpen(false);
  
      toast.success(` ${selectedRound} added successfully!`, { id: toastId });
    } catch (error) {
      toast.error(" Failed to add interview round. Please try again.", { id: toastId });
      console.error("Error adding round:", error);
      setError("Failed to add interview round.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (roundId: string, roundName: string) => {
    setRoundToDelete({ id: roundId, name: roundName });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRound = async () => {
    if (!roundToDelete || !companyId) return;
    const toastId = toast.loading(`Deleting ${roundToDelete.name}...`);
    
    try {
      setDeleteLoading(roundToDelete.id);
      
      const response = await fetch(`${backendUrl}/company/delete-round`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, companyId, roundId: roundToDelete.id })
      });
      
      if (!response.ok) throw new Error("Failed to delete round");
      
      // Remove the deleted round from state
      setRounds(rounds.filter(round => round.id !== roundToDelete.id));
      
      toast.success(` ${roundToDelete.name} deleted successfully!`, { id: toastId });
    } catch (error) {
      toast.error(" Failed to delete interview round. Please try again.", { id: toastId });
      console.error("Error deleting round:", error);
      setError("Failed to delete interview round.");
    } finally {
      setDeleteLoading(null);
      setIsDeleteDialogOpen(false);
      setRoundToDelete(null);
    }
  };
  
  const navigateToPreviousQuestions = (roundId: string, roundName: string) => {
    router.push(`/prev-questions?roundId=${roundId}&roundName=${roundName}&companyId=${companyId}`);
  };

  const getRoundIcon = (roundName: string) => {
    switch (roundName) {
      case "Technical Interview":
        return "💻";
      case "Machine Coding":
        return "⌨️";
      case "Behavioral Interview":
        return "🤝";
      case "System Design":
        return "🏗️";
      case "HR Round":
        return "👥";
      case "Managerial Round":
        return "📊";
      default:
        return "📝";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl min-h-screen">
      {/* Back button and header */}
      <div className="mb-6 lg:mb-8">
        <button 
          onClick={() => router.back()} 
          className="text-[#05FFF8] hover:text-[#05FFF8]/80 flex items-center mb-6 transition-colors cursor-pointer"
          aria-label="Back to Dashboard"
        >
          <ChevronRight className="rotate-180 mr-2" size={16} /> 
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 line-clamp-2">
              {companyName} <span className="text-[#9D4EDD]">Interview Rounds</span>
            </h1>
            <p className="text-sm text-[#D1D7E0]/70">
              Create and manage different interview rounds for your preparation
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#ff2a6d] hover:bg-[#d12564] text-white font-medium flex items-center justify-center gap-2 px-4 py-2 h-10 shadow-lg hover:shadow-[#FF2A6D]/20 transition-all duration-300 cursor-pointer text-sm w-full sm:w-auto">
                <PlusCircle size={16} />
                Add New Round
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#231651] border border-[#9D4EDD] text-[#D1D7E0] w-[90%] max-w-md mx-auto p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-[#05FFF8] text-xl">Add Interview Round</DialogTitle>
                <DialogDescription className="text-sm text-[#D1D7E0]/70 mt-1">
                  Select a round type to add to your interview preparation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="round-select" className="text-[#D1D7E0] mb-2 block text-sm">Round Type</Label>
                  <Select value={selectedRound} onValueChange={setSelectedRound}>
                    <SelectTrigger id="round-select" className="cursor-pointer w-full bg-[#1A1040] border-[#9D4EDD]/50 text-[#D1D7E0] focus:ring-[#05FFF8]/20 focus:border-[#05FFF8] h-10">
                      <SelectValue placeholder="Select a round type" />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer bg-[#231651] border-[#9D4EDD]/50 text-[#D1D7E0]">
                      {roundOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-[#9D4EDD]/20 focus:text-white cursor-pointer">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddRound}
                  className="w-full bg-[#ff2a6d] hover:bg-[#d12564] text-white font-medium py-2 h-10 cursor-pointer"
                  disabled={loading || !selectedRound}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add Round"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#231651] border border-[#9D4EDD] text-[#D1D7E0] w-[90%] max-w-md mx-auto p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-[#05FFF8] text-xl">Delete Interview Round</DialogTitle>
            <DialogDescription className="text-sm text-[#D1D7E0]/70 mt-1">
              Are you sure you want to delete this round? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {roundToDelete && (
              <div className="p-4 bg-[#1A1040] rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{getRoundIcon(roundToDelete.name)}</div>
                  <h3 className="text-base font-medium text-white">{roundToDelete.name}</h3>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-[#1A1040] hover:bg-[#231651] text-[#D1D7E0] border border-[#9D4EDD]/30 w-full sm:w-auto order-2 sm:order-1 h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRound}
              className="bg-[#ff2a6d] hover:bg-[#bf2362] text-white w-full sm:w-auto order-1 sm:order-2 h-10"
              disabled={deleteLoading !== null}
            >
              {deleteLoading !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete Round"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-[#FF9F1C]/10 border border-[#FF9F1C] rounded-lg flex items-center text-[#FF9F1C] text-sm">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Interview Rounds Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#05FFF8]" />
            <span className="ml-3 text-base text-[#D1D7E0]/70">Loading interview rounds...</span>
          </div>
        ) : rounds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {rounds.map((round) => (
              <div
                key={round.id}
                className="p-4 sm:p-5 border border-[#9D4EDD]/30 rounded-xl bg-gradient-to-br from-[#1A1040] to-[#231651]/80 hover:shadow-lg hover:shadow-[#9D4EDD]/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center max-w-[calc(100%-80px)] sm:max-w-[70%]">
                    <div className="text-2xl mr-3 flex-shrink-0">{getRoundIcon(round.roundName)}</div>
                    <h3 className="text-base sm:text-lg font-semibold text-white break-words line-clamp-2">{round.roundName}</h3>
                  </div>
                  <Button 
                    onClick={() => openDeleteConfirmation(round.id, round.roundName)}
                    className="bg-[#ff2a6d] hover:bg-[#bf2362] text-white font-medium ml-2 px-2 sm:px-3 h-8 flex items-center gap-1 transition-all duration-300 cursor-pointer text-xs flex-shrink-0"
                    aria-label={`Delete ${round.roundName}`}
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline ml-1">Delete</span>
                  </Button>
                </div>
                
                <div className="flex flex-col mt-4 pt-4 border-t border-[#9D4EDD]/20 gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {/* Previous Questions Button */}
                    <Button
                      onClick={() => navigateToPreviousQuestions(round.id, round.roundName)}
                      className="bg-[#ff2a6d] hover:bg-[#bf2362] text-white font-medium px-2 sm:px-4 py-2 h-10 flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                    >
                      <History size={14} className="flex-shrink-0" /> 
                      <span className="whitespace-nowrap">View Previous Questions</span>
                    </Button>
                    
                    {/* Open Round Button */}
                    <Button
                      onClick={() => {
                        router.push(`/dashboard/rounds/generate-question?companyId=${companyId}&roundId=${round.id}&roundName=${round.roundName}`);
                      }}
                      className="bg-[#05FFF8] hover:bg-[#05FFF8]/80 text-[#1A1040] font-medium px-2 sm:px-4 py-2 h-10 flex items-center justify-center gap-1 sm:gap-2 group-hover:gap-3 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                    >
                      <span className="whitespace-nowrap">Open this round</span> 
                      <ChevronRight size={14} className="flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 border border-dashed border-[#9D4EDD]/30 rounded-xl bg-[#1A1040]/50">
            <div className="text-[#D1D7E0]/60 mb-6">
              <div className="text-4xl sm:text-5xl mb-4">📋</div>
              <p className="text-lg sm:text-xl mb-2">No interview rounds added yet</p>
              <p className="text-xs sm:text-sm max-w-md mx-auto px-4">Create your first interview round to start generating AI-powered interview questions</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF2A6D]/80 hover:bg-[#FF2A6D] text-white mt-4 text-sm px-4 py-2 h-10">
                  <PlusCircle size={16} className="mr-2" />
                  Add Your First Round
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 sm:mt-12 lg:mt-16 max-w-3xl mx-auto p-4 sm:p-6 rounded-xl bg-[#231651] border border-[#9D4EDD]/20">
        <h3 className="text-lg sm:text-xl font-medium text-[#05FFF8] mb-3">Interview Rounds Guide</h3>
        <p className="text-xs sm:text-sm text-[#D1D7E0]/80 mb-4">
          Each interview round type focuses on different skills. Add multiple rounds to thoroughly prepare for your interview at {companyName}.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2">
          {[
            { icon: "💻", text: "Technical: Coding & algorithms" },
            { icon: "🏗️", text: "System Design: Architecture skills" },
            { icon: "🤝", text: "Behavioral: Soft skills & experience" },
            { icon: "👥", text: "HR: Company fit & expectations" }
          ].map((item, index) => (
            <li key={index} className="flex items-center text-xs sm:text-sm text-[#D1D7E0]/70">
              <span className="mr-2 sm:mr-3 text-base sm:text-lg">{item.icon}</span> {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}