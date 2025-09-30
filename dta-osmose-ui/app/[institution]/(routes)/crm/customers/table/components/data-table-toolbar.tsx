"use client"

import { Table } from "@tanstack/react-table"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/app/[institution]/(routes)/crm/products/table/components/data-table-view-options"
import { useGetCustomersQuery } from "@/state/api"
import { quantityLevel, statuses } from "@/app/[institution]/(routes)/crm/products/table/data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddCustomerDialog } from "../../../components/AddCustomer"
import { NewProduct, useCreateCustomersMutation } from "@/state/api"

import Papa from "papaparse"
import { useState } from "react"
import { useParams } from "next/navigation"

type CustomerFormData = {
  customId: string;
  name: string;
  userName: string;
  phone: string;
  nameresponsable?: string;
  email: string;
  password: string;
  ville?: string;
  website: string;
  status?: boolean;
  institution?: string;
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
  const { institution } = useParams() as { institution: string };

  const handleCreateProduct = async (customerData: CustomerFormData) => {
      await createCustomer({
    newCustomer: customerData,
    institution: institution 
  });
  }
  const { data: customer } = useGetCustomersQuery({ institution })
  const [file, setFile] = useState<File | null>(null)
  const [createCustomer] = useCreateCustomersMutation()
function normalizeText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD") // décompose les lettres accentuées (é → e +  ́ )
    .replace(/[\u0300-\u036f]/g, ""); // supprime les diacritiques
}

const regions = Array.from(
  new Set(customer?.map((c: any) => normalizeText(c.region ?? "")).filter(Boolean))
).map((r) => r.charAt(0).toUpperCase() + r.slice(1)) ?? [
  "Littoral", "Centre", "Nord-Ouest", "Ouest", "Est", 
  "Sud-Ouest", "Adamaoua", "Extrême-Nord", "Nord", "Sud"
];

const villes = Array.from(
  new Set(customer?.map((c: any) => normalizeText(c.ville ?? "")).filter(Boolean))
).map((v) => v.charAt(0).toUpperCase() + v.slice(1)) ?? [
  "Douala", "Yaoundé", "Bafoussam", "Bertoua", "Dschang", 
  "Mbalmayo","Buea","Maroua","Garoua","Ngaoundere","..."
];

  
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
        {/* {table.getColumn("customId") && (
          <DataTableFacetedFilter
            column={table.getColumn("customId")}
            title="ID du client"
            options={statuses}
          />
        )} */}

       {table.getColumn("region") && (
          <DataTableFacetedFilter
            column={table.getColumn("region")}
            title="Région"
            options={regions.map((r:any) => ({ label: r, value: r }))}
          />
        )}

       {table.getColumn("ville") && (
          <DataTableFacetedFilter
            column={table.getColumn("ville")}
            title="Ville"
            options={villes.map((v:any) => ({ label: v, value: v }))}
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
