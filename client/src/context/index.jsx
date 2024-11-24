import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [secretList, setSecretList] = useState([]);
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const [selectedSecret, setSelectedSecret] = useState(null);
  let isLoggedIn = !!token;

  async function fetchListOfSecrets() {
    setPending(true);
    try {
      const response = await fetch("/api/secrets");
      const data = await response.json();
      if (data && data.secrets && data.secrets.length) {
        setSecretList(data.secrets);
        setPending(false);
      }
    } catch (error) {
      console.log(error);
      setPending(false);
    }
  }

  //TODO: Adds Edit and Delete functionality
  function storeTokenInLS(userToken) {
    setToken(userToken);
    return localStorage.setItem("token", userToken);
  }

  function handleLogout() {
    setToken("");
    return localStorage.removeItem("token");
  }

  const userAuthentication = async () => {
    try {
      const response = await fetch("/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      }
    } catch (error) {
      console.error("Error fetching user data");
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]);

  return (
    <GlobalContext.Provider
      value={{
        secretList,
        setSecretList,
        pending,
        setPending,
        fetchListOfSecrets,
        storeTokenInLS,
        handleLogout,
        isLoggedIn,
        user,

        selectedSecret,
        setSelectedSecret,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
