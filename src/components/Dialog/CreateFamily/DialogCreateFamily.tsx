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
import React, { useState } from "react";
import { toast } from "sonner";

interface StatCardProps {
  children: React.ReactNode;
}

type FormDataType = {
  name: string;
  description: string;
};

const DialogCreateFamily: React.FC<StatCardProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const finalFormData = new FormData();

    finalFormData.append("name", formData.name);
    finalFormData.append("description", formData.description);

    setLoading(true);

    createFamily(finalFormData)
      .then((family) => {
        // TODO : Redirect to the family page
        toast.success(`La famille ${family.name} a été créée avec succès !`);
      })
      .catch((error) => {
        if (error instanceof Error) toast.error(error.message);
        else
          toast.error(
            "Une erreur est survenue lors de la création de la famille",
          );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              value={formData.description}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className={"bg-blue-700"}
            onClick={handleSubmit}
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFamily;
