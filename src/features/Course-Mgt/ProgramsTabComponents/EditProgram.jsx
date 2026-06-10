import React, { useEffect, useState } from "react";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Loader2 } from "lucide-react";
import { api } from "@/api/CourseMgtController";
import { providerApi } from "@/api/provider-controller.api";
import toast from "react-hot-toast";

const EditProgram = ({
  program,
  onUpdateSuccess,
}) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] =
    useState(false);
    const [providers, setProviders] = useState([]);
const [providersLoading, setProvidersLoading] = useState(false);

  const [formData, setFormData] =
    useState({
      programTitle: "",
      description: "",
      durationInMonths: "",
      providerId: "",
    });

  useEffect(() => {
    if (program) {
      setFormData({
        programTitle:
          program.programTitle || "",

        description:
          program.description || "",

        durationInMonths:
          program.durationInMonths ||
          "",

        providerId:
          program.providerId || "",
      });
    }
  }, [program]);

  useEffect(() => {
  const fetchProviders = async () => {
    try {
      setProvidersLoading(true);

      const response =
        await providerApi.getAllProviders();

      //console.log("Providers Response",response);

      setProviders(
        response?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load providers",
        error
      );

      toast.error(
        "Failed to load providers"
      );
    } finally {
      setProvidersLoading(false);
    }
  };

  fetchProviders();
}, []);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        programTitle:
          formData.programTitle,

        description:
          formData.description,

        durationInMonths:
          Number(
            formData.durationInMonths
          ),

        providerId: Number(
          formData.providerId
        ),
      };

      console.log(
        "UPDATE PAYLOAD",
        payload
      );

      await api.updateProgram(
        program.id,
        payload
      );

      toast.success(
        "Program updated successfully"
      );

      setOpen(false);

      onUpdateSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update program"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-1 h-auto"
        >
          <Pencil className="w-5 h-5 text-green-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            Edit Program
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Program Id */}
          <div>
            <label className="text-sm font-medium">
              Program ID
            </label>

            <Input
              value={
                program?.programId || ""
              }
              disabled
              className="px-4 mt-1 bg-gray-100"
            />
          </div>

          {/* Program Title */}
          <div>
            <label className="text-sm font-medium">
              Program Title
            </label>

            <Input
              name="programTitle"
              value={
                formData.programTitle
              }
              onChange={
                handleChange
              }
              placeholder="Program Title"
              required
               className="px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              rows={4}
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Program Description"
              required
               className="px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium">
              Duration (Months)
            </label>

            <Input
              type="number"
              name="durationInMonths"
              value={
                formData.durationInMonths
              }
              onChange={
                handleChange
              }
              required
               className="px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
            />
          </div>

          {/* Provider */}
       <div>
  <label className="text-sm font-medium">
    Provider
  </label>

  <select
    name="providerId"
    value={formData.providerId}
    onChange={handleChange}
   className="w-full h-[32px] px-4 rounded-[8px] bg-[#F3F3F5] border-none focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-0"
    required
  >
    <option value="">
      {providersLoading
        ? "Loading Providers..."
        : "Select Provider"}
    </option>

    {providers.map((provider) => (
      <option
        key={provider.id}
        value={provider.id}
      >
        {provider.providerName}
      </option>
    ))}
  </select>
</div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Update Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProgram;