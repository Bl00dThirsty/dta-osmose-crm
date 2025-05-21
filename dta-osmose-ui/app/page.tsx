

import React from 'react'
import Footer from '@/app/[institution]/(routes)/components/Footer'
import Link from 'next/link';
import { Button } from '@/components/ui/button'



export default function InstitutionPage() {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-50 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-white-800">Choisissez votre interface</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/iba" passHref>
          <Button className="text-lg px-10 py-6 w-60 text-white bg-blue-600 hover:bg-blue-700">
            IBA
          </Button>
        </Link>
        <Link href="/asermpharma" passHref>
          <Button className="text-lg px-10 py-6 w-60 text-white bg-green-600 hover:bg-green-700">
            ASERMPHARMA
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  )
}