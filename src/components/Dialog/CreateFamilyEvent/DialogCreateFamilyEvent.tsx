"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DialogCreateFamilyEventProps {
  children: React.ReactNode;
  onCreateFamilyEvent?: () => void;
}

type FormDataType = {
  title: string;
  description: string;
  date: string;
  location: string;
};

const DialogCreateFamilyEvent: React.FC<DialogCreateFamilyEventProps> = ({
  children,
  onCreateFamilyEvent = () => {},
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { loading: userLoading, user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userLoading || !user)
      toast.error("Impossible de créer l'évènement sans être connecté.");

    const finalFormData = new FormData();

    finalFormData.append("title", formData.title);
    finalFormData.append("description", formData.description);
    finalFormData.append("date", formData.date);
    finalFormData.append("location", formData.location);

    setLoading(true);

    // TODO : server action to create event
    // .finally(() => setLoading(false));

    onCreateFamilyEvent();
  };

  return (
    <Dialog open={isModalOpen} modal={true}>
      <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={"text-center"}>
            Créer un évènement
          </DialogTitle>
          <DialogDescription className={"text-center"}>
            Créez un évènement pour votre famille et invitez vos proches.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre
            </Label>
            <Input
              id="title"
              name={"title"}
              value={formData.title}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name={"description"}
              value={formData.description}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Lieu
            </Label>
            <Input
              id="location"
              name={"location"}
              value={formData.location}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !formData.date && "text-gray-400",
                  )}
                >
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString()
                    : "Sélectionnez une date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => {
                    setFormData({
                      ...formData,
                      date: date?.toISOString() || "",
                    });
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className={"flex flex-row gap-5"}>
          <Button
            type="button"
            className={"bg-red-700 flex-1"}
            onClick={() => setIsModalOpen(false)}
            disabled={loading || userLoading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Annuler
          </Button>
          <Button
            type="button"
            className={"bg-blue-700 flex-1"}
            onClick={handleSubmit}
            disabled={loading || userLoading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Création en cours..." : "Créer l'évènement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFamilyEvent;
