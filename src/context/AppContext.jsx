// context/AppContext.js
import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [applicationCount, setApplicationCount] = useState(87); // Default value or fetched

  return (
    <AppContext.Provider value={{ applicationCount, setApplicationCount }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);