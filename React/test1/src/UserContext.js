import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // user: { name, email, password }

  const login = (id, pw) => {
    setUser({ name: id, email: id + "@gmail.com" });
  };

  const register = (name, email) => {
    setUser({ name, email });
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}