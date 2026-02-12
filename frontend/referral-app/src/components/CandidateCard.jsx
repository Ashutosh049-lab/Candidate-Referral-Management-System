
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, Mail, Phone, Briefcase, FileText, Trash2 } from "lucide-react";

const CandidateCard = ({ candidate, onStatusUpdate, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const statusColors = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Reviewed: "bg-blue-100 text-blue-700 border-blue-200",
    Hired: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(candidate.id, newStatus);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(candidate.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        data-testid={`candidate-card-${candidate.id}`}
        className="bg-card text-card-foreground rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {candidate.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Briefcase className="h-3 w-3" />
                {candidate.job_title}
              </div>
            </div>
          </div>
          <Button
            data-testid={`delete-candidate-${candidate.id}`}
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{candidate.phone}</span>
          </div>
          {candidate.resume_url && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <a
                href={`${process.env.REACT_APP_BACKEND_URL}${candidate.resume_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
                data-testid={`resume-link-${candidate.id}`}
              >
                View Resume
              </a>
            </div>
          )}
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-xs text-muted-foreground">Status</p>
          <Select
            data-testid={`status-select-${candidate.id}`}
            value={candidate.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger
              className={`w-full ${statusColors[candidate.status]} border font-medium`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {candidate.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete"
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CandidateCard;