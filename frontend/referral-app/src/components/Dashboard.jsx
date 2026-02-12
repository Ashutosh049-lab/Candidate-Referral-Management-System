import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import MetricCard from "./MetricCard";

import CandidateCard from "./CandidateCard";
import AddReferralDialog from "./AddReferralDialog";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API}/candidates`);
      setCandidates(response.data);
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API}/metrics`);
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCandidates(), fetchMetrics()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...candidates];

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  }, [searchQuery, statusFilter, candidates]);

  const handleAddCandidate = async (formData) => {
    try {
      await axios.post(`${API}/candidates`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Candidate added successfully!");
      setDialogOpen(false);
      await fetchCandidates();
      await fetchMetrics();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error(
        error.response?.data?.detail || "Failed to add candidate"
      );
      throw error;
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API}/candidates/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status updated successfully!");
      await fetchCandidates();
      await fetchMetrics();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.detail || "Failed to update status"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/candidates/${id}`);
      toast.success("Candidate deleted successfully!");
      await fetchCandidates();
      await fetchMetrics();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error(
        error.response?.data?.detail || "Failed to delete candidate"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 md:p-8 lg:p-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
              Candidate Referrals
            </h1>
            <p className="text-base text-muted-foreground">
              Track and manage your candidate referrals
            </p>
          </div>
          <Button
            data-testid="add-referral-button"
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all active:scale-95 rounded-md"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Referral
          </Button>
        </div>

        {metrics && <MetricsCards metrics={metrics} />}

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No candidates match your filters"
                : "No candidates yet. Add your first referral!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
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