import React from 'react'
import Footer from './[institution]/(routes)/components/Footer'
import Link from 'next/link';
import { Button } from '@/components/ui/button'

export default function InstitutionPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-2xl font-bold">Choisissez votre interface</h1>
      <div className="space-x-4">
        <Button>
            <Link href="/iba">IBA</Link> 
        </Button>
        <Button>
            <Link href="/asermpharma">ASERMPHARMA</Link>
        </Button>
      </div>
      <Footer />
    </div>
  )
}
