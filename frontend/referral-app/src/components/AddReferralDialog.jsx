
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2 } from "lucide-react";

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      "Invalid phone number format"
    ),
  job_title: z.string().min(2, "Job title must be at least 2 characters"),
  resume: z.any().optional(),
});

const AddReferralDialog = ({ open, onOpenChange, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(candidateSchema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".pdf")) {
        alert("Only PDF files are allowed");
        e.target.value = "";
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("job_title", data.job_title);
      if (selectedFile) {
        formData.append("resume", selectedFile);
      }

      await onSubmit(formData);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Referral</DialogTitle>
          <DialogDescription>
            Fill in the candidate details to submit a new referral.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Candidate Name *</Label>
            <Input
              id="name"
              data-testid="candidate-name-input"
              placeholder="John Doe"
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              data-testid="candidate-email-input"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className="w-full"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              data-testid="candidate-phone-input"
              placeholder="+1234567890"
              {...register("phone")}
              className="w-full"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              data-testid="candidate-jobtitle-input"
              placeholder="Software Engineer"
              {...register("job_title")}
              className="w-full"
            />
            {errors.job_title && (
              <p className="text-sm text-destructive">
                {errors.job_title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF only)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="resume"
                data-testid="candidate-resume-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full"
              />
              {selectedFile && <FileText className="h-5 w-5 text-primary" />}
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-testid="cancel-referral-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="submit-referral-button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Referral"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReferralDialog;