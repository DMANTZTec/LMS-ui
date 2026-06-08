import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { api } from "@/api/CourseMgtController";
import { providerApi } from "@/api/provider-controller.api";

const ProgramFormDialog = ({ onSubmitSuccess }) => {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);

  const [formData, setFormData] = useState({
    programTitle: "",
    description: "",
    durationInMonths: "",
    providerId: "",
  });

  // Fetch providers from backend API when dialog is mounted or opened
  useEffect(() => {
    const fetchProviders = async () => {
      setProvidersLoading(true);
      try {
        // Change method name if your api file uses a different naming convention (e.g., getProviders)
        const result = await providerApi.getAllProviders();
        if (result && result.data) {
          setProviders(result.data);
        }
      } catch (error) {
        console.error("Failed to load providers:", error);
      } finally {
        setProvidersLoading(false);
      }
    };

    if (open) {
      fetchProviders();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      programTitle: formData.programTitle,
      description: formData.description,
      durationInMonths: Number(formData.durationInMonths),
      providerId: Number(formData.providerId),
    };

    //console.log("Program Payload", payload);

    try {
      await api.createProgram(payload);
      
      setOpen(false);
      setFormData({
        programTitle: "",
        description: "",
        durationInMonths: "",
        providerId: "",
      });

      onSubmitSuccess?.();
    } catch (error) {
      console.error("Failed to save program:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 ">
          <Plus size={16} />
          Create Program
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Program Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Program Title
            </label>
            <Input
              name="programTitle"
              value={formData.programTitle}
              onChange={handleChange}
              placeholder="Enter Program Title"
              required
              className="px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Program Description"
              rows={4}
              required
               className="px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Duration (Months)
            </label>
            <Input
              type="number"
              name="durationInMonths"
              value={formData.durationInMonths}
              onChange={handleChange}
              placeholder="6"
              required
               className="px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />
          </div>

          {/* Provider */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Provider
            </label>
            <div className="relative">
              <select  className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
                name="providerId"
                value={formData.providerId}
                onChange={handleChange}
                disabled={providersLoading}
                required
              >
                <option value="">
                  {providersLoading ? "Loading providers..." : "Select Provider"}
                </option>
                
                {/* Dynamically mapped external providers list */}
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {/* {` ${provider.providerName} @ ${provider.providerOrgName}`} */}
                    {provider.providerName} 
                  </option>
                ))}
              </select>
              
              {providersLoading && (
                <div className="absolute right-8 top-2.5">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={providersLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramFormDialog;