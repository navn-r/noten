import React, { createContext, useContext } from 'react';
import DataService from './DataService';

type IDataContextValue = {
  service: DataService;
};

export const useData = (): IDataContextValue => useContext(DataContext);
export const useService = (): DataService => {
  const { service } = useData();
  return service;
};

const DataContext = createContext<IDataContextValue>({
  service: {},
});

export const DataProvider: React.FC = ({ children }) => {
  const service = new DataService();
  const value = { service };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
