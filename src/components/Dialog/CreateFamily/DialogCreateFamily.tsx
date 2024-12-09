"use client";

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
import { useState } from "react";

interface StatCardProps {
  children: React.ReactNode;
}

type FormDataType = {
  name: string;
  description?: string;
};

const DialogCreateFamily: React.FC<StatCardProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <Button type="submit" className={"bg-blue-700"}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFamily;
