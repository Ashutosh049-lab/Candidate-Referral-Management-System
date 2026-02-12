



import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import MetricCard from "./MetricCard";
import CandidateCard from "./CandidateCard";
import AddReferralDialog from "./AddReferralDialog";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ FETCH CANDIDATES
  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API}/candidates`);

      const candidateData = Array.isArray(response.data)
        ? response.data
        : [];

      setCandidates(candidateData);
      setFilteredCandidates(candidateData);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    }
  };

 
  const fetchMetrics = async () => {
    try {
      const response = await axios.get(
        `${API}/candidates/metrics`
      );
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCandidates(), fetchMetrics()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // SEARCH + FILTER
  useEffect(() => {
    let filtered = [...candidates];

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.job_title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.status === statusFilter
      );
    }

    setFilteredCandidates(filtered);
  }, [searchQuery, statusFilter, candidates]);

  // ADD
  const handleAddCandidate = async (formData) => {
    try {
      await axios.post(`${API}/candidates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Candidate added successfully!");
      setDialogOpen(false);
      await fetchCandidates();
      await fetchMetrics();
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to add candidate"
      );
    }
  };

 
  const handleStatusUpdate = async (id, newStatus) => {
    if (!id) {
      toast.error("Invalid candidate ID");
      return;
    }

    try {
      await axios.put(
        `${API}/candidates/${id}/status`,
        { status: newStatus }
      );

      toast.success("Status updated successfully!");
      await fetchCandidates();
      await fetchMetrics();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update status"
      );
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid candidate ID");
      return;
    }

    try {
      await axios.delete(`${API}/candidates/${id}`);
      toast.success("Candidate deleted successfully!");
      await fetchCandidates();
      await fetchMetrics();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to delete candidate"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">

        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">
            Candidate Referrals
          </h1>

          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Referral
          </Button>
        </div>

        {metrics && <MetricCard metrics={metrics} />}

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16">
            No candidates found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}   
                candidate={candidate}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddReferralDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddCandidate}
      />
    </div>
  );
};

export default Dashboard;
