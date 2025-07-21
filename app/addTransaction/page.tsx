import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import AddTransactionModal from '@/components/AddTransactionModal'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <Navbar/>
        <AddTransactionModal/>
      </div>
    </ProtectedRoute>
  );
}

export default page