"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

import { quantityLevel, statuses } from "@/app/[institution]/(routes)/crm/products/table/data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddCustomerDialog } from "../../../components/AddCustomer"
import { NewProduct, useCreateCustomersMutation } from "@/state/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"

type CustomerFormData = {
  customId: string;
  name: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  ville?: string;
  website: string;
  status?: boolean;
  type_customer?: string;
  role: string;
  quarter?: string;
  region?: string;
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleCreateProduct = async (customerData: CustomerFormData) => {
    await createCustomer(customerData);
  }
  
  const [file, setFile] = useState<File | null>(null)
  const [createCustomer] = useCreateCustomersMutation()
  
   
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Rechercher les clients..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type_customer") && (
          <DataTableFacetedFilter
            column={table.getColumn("type_customer")}
            title="type du client"
            options={statuses}
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
      <AddCustomerDialog onCreate={handleCreateProduct} />
      <DataTableViewOptions table={table} />
    </div>
  )
}
