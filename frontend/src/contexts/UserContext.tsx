import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the User type and the context
type User = {
  id: number;
  name: string;
  role: "admin" | "customer";
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Define the type for the children prop
type UserProviderProps = {
  children: ReactNode;  // This allows any valid React children (components, strings, etc.)
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
