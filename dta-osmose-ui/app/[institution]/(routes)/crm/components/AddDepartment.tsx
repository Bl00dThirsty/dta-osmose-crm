"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NewDesignation } from "@/state/api"
import { PlusIcon } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { v4 } from "uuid"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type DepartmentFormData = {
  name: string;
  
}

type AddDepartmentDialogProps = {
  onCreate: (DesignationData: DepartmentFormData) => void;
}

export const AddDepartmentDialog = ({ onCreate }: AddDepartmentDialogProps) => {
  const [formData, setFormData] = useState({
    id: v4(),
    name: "",
  });

  const resetForm= () => {
   setFormData({
     id: v4(),
     name: "",
   });
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    resetForm();
    toast.success('Notification de succès !');
  };

  return (
    <>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter <PlusIcon /></Button>
      </DialogTrigger>
      <DialogContent className="sm:w-3/4">
        <DialogHeader>
          <DialogTitle>Ajouter un departement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {[
            { label: "Nom", name: "name", type: "text" },
            
          ].map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">{field.label}</Label>
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          ))}

          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <ToastContainer />
    </>
  )
}
