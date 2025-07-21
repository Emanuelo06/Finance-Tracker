import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddBudgetModal from '@/components/AddBudgetModal';
import React from 'react';

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <Navbar/>
        <AddBudgetModal/>
      </div>
    </ProtectedRoute>
  );
};

export default page;
