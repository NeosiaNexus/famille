"use client";
import { createFamilyEvent } from "@/actions/create-family-event-action";
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
import { CalendarIcon, Clock, Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DialogCreateFamilyEventProps {
  children: React.ReactNode;
  onCreateFamilyEvent?: () => void;
  familyId: string;
}

type FormDataType = {
  title: string;
  description: string;
  date: string;
  location: string;
  time: string;
};

const DialogCreateFamilyEvent: React.FC<DialogCreateFamilyEventProps> = ({
  children,
  onCreateFamilyEvent = () => {},
  familyId,
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    date: "",
    location: "",
    time: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [allDay, setAllDay] = useState<boolean>(true);

  const { loading: userLoading, user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log(e.target.id, e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userLoading || !user) {
      toast.error("Impossible de créer l'évènement sans être connecté.");
      return;
    }

    // Création de l'objet date complet (date + heure)
    let finalDate: string;

    if (formData.date) {
      const date = new Date(formData.date);

      if (formData.time) {
        // Si une heure est spécifiée, on l'ajoute à la date
        const [hours, minutes] = formData.time.split(":");
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        // Si aucune heure n'est spécifiée, on met 00:00:00 par défaut
        date.setHours(0, 0, 0, 0);
      }

      finalDate = date.toISOString();
    } else {
      toast.error("Veuillez sélectionner une date pour l'évènement.");
      return;
    }

    // Préparer les données finales pour l'API
    const finalFormData = new FormData();
    finalFormData.append("title", formData.title);
    finalFormData.append("description", formData.description);
    finalFormData.append("location", formData.location);
    finalFormData.append("date", finalDate);
    finalFormData.append("familyId", familyId);

    setLoading(true);

    createFamilyEvent(finalFormData)
      .then(() => {
        toast.success("L'évènement a été créé avec succès !");
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          time: "",
        });
        setAllDay(false);
        onCreateFamilyEvent();
      })
      .catch((error) => {
        if (error instanceof Error) toast.error(error.message);
        else
          toast.error(
            "Une erreur est survenue lors de la création de l'évènement.",
          );
      })
      .finally(() => setLoading(false));
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
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name={"title"}
              value={formData.title}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name={"description"}
              value={formData.description}
              className="col-span-3 max-h-40"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              name={"location"}
              value={formData.location}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
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
          <div className="flex flex-col gap-3">
            <Label htmlFor="time" className="tex">
              Heure
            </Label>
            {allDay && (
              <>
                <Button
                  variant={"outline"}
                  className={"col-span-3"}
                  onClick={() => setAllDay(false)}
                >
                  <Clock /> Définir une heure
                </Button>
                <p
                  className={
                    "text-gray-400 text-sm col-span-3 w-full text-center"
                  }
                >
                  Cliquez sur le bouton ci-dessus pour définir une heure à cet
                  évènement ou laissez-le tel quel pour le considérer comme une
                  journée entière.
                </p>
              </>
            )}
            {!allDay && (
              <>
                <div className={"flex items-center gap-3 w-full"}>
                  <Input
                    id="time"
                    name={"time"}
                    type={"time"}
                    value={formData.time}
                    className="col-span-3"
                    onChange={handleChange}
                  />
                  <Button
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => {
                      setAllDay(true);
                      setFormData({ ...formData, time: "" });
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
                <p
                  className={
                    "text-gray-400 text-sm col-span-3 w-full text-center"
                  }
                >
                  Si vous ne renseignez pas d'heure, l'évènement sera considéré
                  comme toute la journée.
                </p>
              </>
            )}
          </div>
        </div>
        <DialogFooter className={"flex flex-row gap-5 mt-3"}>
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
