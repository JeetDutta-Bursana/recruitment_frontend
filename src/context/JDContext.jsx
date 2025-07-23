import { createContext, useState } from 'react';

export const JDContext = createContext();

export const JDProvider = ({ children }) => {
  const [jdData, setJDData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    department: '',
    mode: '',
    requirements:'',
    minsalary: '',
  });

  return (
    <JDContext.Provider value={{ jdData, setJDData }}>
      {children}
    </JDContext.Provider>
  );
};
