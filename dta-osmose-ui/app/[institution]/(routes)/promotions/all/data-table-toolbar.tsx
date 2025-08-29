"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddRoleDialog } from "../../crm/components/AddRole"
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"
import { useGetAllPromotionsQuery } from "@/state/api"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { institution } = useParams() as { institution: string }
  const isFiltered = table.getState().columnFilters.length > 0;
  const { data: Allpromotions } = useGetAllPromotionsQuery({institution})
  const products = Array.from(new Set(Allpromotions?.map((c:any) => c.product?.designation).filter(Boolean))) ?? ["..."];
  const Status = Array.from(
    new Set(Allpromotions?.map((c: any) => (c.status ? "Active" : "Inactive")).filter(Boolean))
  ) ?? ["..."];
  const [file, setFile] = useState<File | null>(null)   
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer en fonction du titre..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("product") && (
           <DataTableFacetedFilter
              column={table.getColumn("product")}
              title="Produit"
              options={products.map((p:any) => ({ label: p, value: p }))}
            />
        )}

        {table.getColumn("status") && (
          <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={Status.map((s:any) => ({ label: s, value: s }))}
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
      
      <DataTableViewOptions table={table} />
    </div>
  )
}
