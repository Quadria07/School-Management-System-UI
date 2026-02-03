import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Child {
  id: string;
  name: string;
  class: string;
  photo: string;
  age: number;
  admissionNumber: string;
  outstandingBalance: number;
}

interface ParentContextType {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  children: Child[];
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export const ParentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [childrenList] = useState<Child[]>([
    {
      id: '1',
      name: 'Oluwatunde Adebayo',
      class: 'JSS 3A',
      photo: '👦',
      age: 14,
      admissionNumber: 'BFOIA/2022/1234',
      outstandingBalance: 0,
    },
    {
      id: '2',
      name: 'Adeola Adebayo',
      class: 'SSS 1B',
      photo: '👧',
      age: 16,
      admissionNumber: 'BFOIA/2020/0892',
      outstandingBalance: 45000,
    },
    {
      id: '3',
      name: 'Chinedu Adebayo',
      class: 'Primary 5',
      photo: '👦',
      age: 10,
      admissionNumber: 'BFOIA/2024/2156',
      outstandingBalance: 0,
    },
  ]);

  const [selectedChild, setSelectedChild] = useState<Child>(childrenList[0]);

  return (
    <ParentContext.Provider value={{ selectedChild, setSelectedChild, children: childrenList }}>
      {children}
    </ParentContext.Provider>
  );
};

export const useParent = () => {
  const context = useContext(ParentContext);
  if (context === undefined) {
    return null; // Return null instead of throwing, making it safe to use in Navbar
  }
  return context;
};