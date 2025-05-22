"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"
import { PlusIcon } from "lucide-react";
import { quantityLevel, statuses, labels } from "@/app/[institution]/(routes)/crm/products/table/data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import RegisterComponent from "../../../add/components/adduser";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/app/[institution]/(auth)/sign-in/context/authContext";
import Papa from "papaparse"
import { useState } from "react"


type UserFormData = {
  firstName: string;
    lastName: string;
    userName: string;
    password: string;
    email: string;
    phone?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    gender?: string;
    birthday?: string;
    CnpsId?: string;
    joinDate?: string;
    employeeId?: string;
    bloodGroup?: string;
    salary?: number;
    role: string;
    status?: boolean;
    departmentId?: number;
    designationId?: number;
    emergencyPhone1?: string;
    emergencyname1?: string;
    emergencylink1?: string; 
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [open, setOpen] = useState(false);
  const handleCreateProduct = async (userData: UserFormData) => {
    await register(userData);
  }
  
  const [file, setFile] = useState<File | null>(null)
  const {register} = useAuth()
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        setFile(selectedFile)
      }
    }
  
    
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les produits..."
          value={(table.getColumn("lastName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("lastName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {table.getColumn("email") && (
          <DataTableFacetedFilter
            column={table.getColumn("email")}
            title="email"
            options={labels}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {/* <Button variant="outline">Ajouter <RegisterComponent /><PlusIcon /></Button> */}
      <Button variant="outline" onClick={() => setOpen(true)}>
        Ajouter <PlusIcon className="ml-2" />
      </Button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <RegisterComponent />
        </Modal>
      )}
      {/* <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="px-2 lg:px-3"><Upload className="mr-2" /> Importer CSV</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importer un fichier CSV</DialogTitle>
          </DialogHeader>
          <Input type="file" accept=".csv" onChange={handleFileChange} />
        </DialogContent>
    </Dialog> */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
