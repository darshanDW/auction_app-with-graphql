import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";

export const AuthContext = createContext<{ userLogin: boolean; setuserLogin: Dispatch<SetStateAction<boolean>> } | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLogin, setuserLogin] = useState<any>(null); // Replace 'any' with a specific type if possible
  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
