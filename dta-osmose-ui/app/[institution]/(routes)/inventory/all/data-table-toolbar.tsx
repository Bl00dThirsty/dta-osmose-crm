"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

import { DataTableFacetedFilter } from "../../user/all/table/components/data-table-faceted-filter"
import { AddRoleDialog } from "../../crm/components/AddRole"
import { useRouter, useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"

type SaleInvoiceFormData = {
  customerId: number;
  userId: number;
  institutionId: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  customer:{
    id: number;
    name: string;
    phone: string;
    email: string;

  }
  
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null)   
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les inventaires..."
          value={(table.getColumn("createdAt")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("createdAt")?.setFilterValue(event.target.value)
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
      <Button variant="outline" className=" mr-2 bg-blue-500 hover:bg-blue-200" onClick={() => router.push(`/${institution}/inventory`)}>Ajouter <PlusIcon className="ml-2" /></Button>
      <DataTableViewOptions table={table} />
    </div>
  )
}
