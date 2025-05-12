"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/(routes)/crm/products/table/components/data-table-view-options"

import { quantityLevel, statuses } from "@/app/(routes)/crm/products/table/data/data"
import { DataTableFacetedFilter } from "../../user/all/table/components/data-table-faceted-filter"
//import { AddDesignationDialog } from "../../../crm/components/AddDesignation"
import { NewDesignation, useCreateRolesMutation } from "@/state/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"

type RoleFormData = {
  name: string;
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleCreateDesignation = async (roleData: RoleFormData) => {
    await createRole(roleData);
  }
  
  const [file, setFile] = useState<File | null>(null)
  const [createRole] = useCreateRolesMutation()
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        setFile(selectedFile)
      }
    }
  
    const handleUpload = () => {
      if (!file) return
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const Roles = results.data as any[]
  
          for (const role of Roles) {
            try {
              await createRole({
                name: role.name,
              }).unwrap()
            } catch (error) {
              console.error("Erreur lors de l'ajout du produit :", error)
            }
          }
          alert("Produits importés avec succès...")
        },
        error: (err) => {
          console.error("Erreur lors de la lecture du CSV :", err)
        }
      })
    }
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les produits..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
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
      {/* <AddDesignationDialog onCreate={handleCreateDesignation} /> */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
