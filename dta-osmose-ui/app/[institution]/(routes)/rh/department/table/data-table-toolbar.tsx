"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

import { quantityLevel, statuses } from "@/app/[institution]/(routes)/crm/products/table/data/data"
import { DataTableFacetedFilter } from "../../../user/all/table/components/data-table-faceted-filter"
import { AddDepartmentDialog } from "../../../crm/components/AddDepartment"
import { useCreateDepartmentsMutation, useCreateDesignationsMutation } from "@/state/api"
import Papa from "papaparse"
import { useState } from "react"
import UserPrivateComponent from "../../../components/usePrivateComponent";

type DepartmentFormData = {
 
  name: string;
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleCreateDesignation = async (departmentData: DepartmentFormData) => {
    await createDepartment(departmentData);
  }
  
  const [file, setFile] = useState<File | null>(null)
  const [createDepartment] = useCreateDepartmentsMutation()
    
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
       <UserPrivateComponent permission="create-department">
          <AddDepartmentDialog onCreate={handleCreateDesignation} />
       </UserPrivateComponent>
      <DataTableViewOptions table={table} />
    </div>
  )
}
