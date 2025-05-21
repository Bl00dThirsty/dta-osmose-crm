"use client";

import { useState } from "react";
import { useAuth } from "@/app/[institution]/(auth)/sign-in/context/authContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetDepartmentsQuery, useGetDesignationsQuery, useGetRolesQuery } from "@/state/api"
import Link from "next/link";

export default function RegisterComponent() {
  const { register, error } = useAuth();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    birthday: "",
    CnpsId: "",
    gender: "",
    joinDate: "",
    employeeId: "",
    bloodGroup: "",
    salary: "",
    role: "",
    departmentId: "",
    designationId: "",
    emergencyPhone1: "",
    emergencyname1: "",
    emergencylink1: "",
  });

  const resetForm = () => {
    setFormValues({
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zipCode: "",
      birthday: "",
      CnpsId: "",
      gender: "",
      joinDate: "",
      employeeId: "",
      bloodGroup: "",
      salary: "",
      role: "",
      departmentId: "",
      designationId: "",
      emergencyPhone1: "",
      emergencyname1: "",
      emergencylink1: "",
    });
  };
  

  const { data: department = [] } = useGetDepartmentsQuery();
  const { data: designation = [] } = useGetDesignationsQuery();
  const { data: role = [] } = useGetRolesQuery();


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // convert number fields
      const formattedValues = {
        ...formValues,
        salary: formValues.salary ? parseFloat(formValues.salary) : undefined,
        departmentId: formValues.departmentId ? parseInt(formValues.departmentId) : undefined,
        designationId: formValues.designationId ? parseInt(formValues.designationId) : undefined
      };

      await register(formattedValues);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-8 px-4">
      <Card className="shadow-lg w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Créer un compte utilisateur</CardTitle>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Prénom", name: "firstName" },
              { label: "Nom", name: "lastName" },
              { label: "Nom d'utilisateur", name: "userName" },
              { label: "Mot de passe", name: "password", type: "password" },
              { label: "Email", name: "email", type: "email" },
              { label: "Téléphone", name: "phone" },
              { label: "Adresse", name: "street" },
              { label: "Ville", name: "city" },
              { label: "Code postal", name: "zipCode" },
              { label: "Date de naissance", name: "birthday", type: "date" },
              { label: "Date d'embauche", name: "joinDate", type: "date" },
              { label: "Matricule", name: "employeeId" },
              { label: "Matricule CNPS", name: "CnpsId" }, 
            //   { label: "Groupe sanguin", name: "bloodGroup" },
              //{ label: "Lien vers l'image", name: "image" },
              { label: "Salaire", name: "salary", type: "number" },
            //   { label: "ID Poste", name: "designationId", type: "number" }, 
              { label: "Numero à contacter en cas d'urgence", name: "emergencyPhone1" },
              { label: "Nom de la personne", name: "emergencyname1"},
              { label: "lien de parenté", name: "emergencylink1" }
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Input
                  name={name}
                  type={type}
                  value={formValues[name as keyof typeof formValues] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Selects */}
            <div>
              <Label htmlFor="gender">Sexe</Label>
              <select
                name="gender"
                className="w-full border rounded-md p-2"
                value={formValues.gender}
                onChange={handleChange}
              >
                <option value="">Sélectionner </option>
                <option value="masculin">Homme</option>
                <option value="feminin">Femme</option>
              </select>
            </div>

            {/* <div>
              <Label htmlFor="role">Rôle</Label>
              <select
                name="role"
                className="w-full border rounded-md p-2"
                value={formValues.role}
                onChange={handleChange}
              >
                <option value="">Sélectionner </option>
                <option value="admin">admin</option>
                <option value="user">staff</option>
                <option value="user">manager</option>
              </select>
            </div> */}
            <div>
               <Label htmlFor="role">Rôle</Label>
               <select
                   name="role"
                   className="w-full border rounded-md p-2"
                   value={formValues.role}
                   onChange={handleChange}
                >
                <option value="">Sélectionner</option>
                {role.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
           </div>

            
            <div>
               <Label htmlFor="departmentId">Département</Label>
                 <select
                    name="departmentId"
                    className="w-full border rounded-md p-2"
                    value={formValues.departmentId}
                    onChange={handleChange}
                >
                <option value="">Sélectionner</option>
                {department.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                 ))}
               </select>
           </div>

           <div>
                <Label htmlFor="designationId">Poste</Label>
               <select
                name="designationId"
                className="w-full border rounded-md p-2"
                value={formValues.designationId}
                onChange={handleChange}
               >
              <option value="">Sélectionner</option>
               {designation.map(des => (
               <option key={des.id} value={des.id}>{des.name}</option>
               ))}
              </select>
           </div>

            <div>
              <Label htmlFor="bloodGroup">Groupe Sanguin</Label>
              <select
                name="bloodGroup"
                className="w-full border rounded-md p-2"
                value={formValues.bloodGroup}
                onChange={handleChange}
              >
                {/* <option value="">Sélectionner </option> */}
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
                <option value="O+">O+</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer le compte"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
