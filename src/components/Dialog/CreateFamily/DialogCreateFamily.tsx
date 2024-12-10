"use client";
import createFamily from "@/actions/create-family-action";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface StatCardProps {
  children: React.ReactNode;
  onCreateFamily?: () => void;
}

type FormDataType = {
  name: string;
  description: string;
};

const DialogCreateFamily: React.FC<StatCardProps> = ({
  children,
  onCreateFamily = () => {},
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { loading: userLoading, user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userLoading || !user)
      toast.error("Impossible de créer la famille sans être connecté.");

    const finalFormData = new FormData();

    finalFormData.append("name", formData.name);
    finalFormData.append("description", formData.description);
    finalFormData.append("userId", user?.id as string);

    setLoading(true);

    createFamily(finalFormData)
      .then((family) => {
        // TODO : Redirect to the family page
        toast.success(`La famille "${family.name}" a été créée avec succès !`);
        setFormData({ name: "", description: "" });
        onCreateFamily();
        setIsModalOpen(false);
      })
      .catch((error) => {
        if (error instanceof Error) toast.error(error.message);
        else
          toast.error(
            "Une erreur est survenue lors de la création de la famille.",
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
          <DialogTitle>Créer une famille</DialogTitle>
          <DialogDescription>
            Créez une nouvelle famille, invitez vos proches et gérez facilement
            votre emploi du temps familial.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              name={"name"}
              value={formData.name}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name={"description"}
              value={formData.description}
              className="col-span-3"
              onChange={handleChange}
            />
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
            {loading ? "Création en cours..." : "Créer la famille"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFamily;
