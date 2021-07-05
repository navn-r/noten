import React, { createContext, useContext } from 'react';
import DataService from './DataService';

export const useData = () => useContext(DataContext);

const DataContext = createContext(null as any);

export const DataProvider: React.FC = ({ children }) => {
  const service = new DataService();
  const value = { service };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
