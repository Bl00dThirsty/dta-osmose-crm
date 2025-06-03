"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

import { DataTableFacetedFilter } from "../../../user/all/table/components/data-table-faceted-filter"
import { AddRoleDialog } from "../../../crm/components/AddRole"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"
import moment from "moment";

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
  const [startdate, setStartdate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [enddate, setEnddate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
 
  
  const [file, setFile] = useState<File | null>(null)   
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les produits..."
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
      
      <DataTableViewOptions table={table} />
    </div>
  )
}
