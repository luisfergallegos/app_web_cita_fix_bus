import { createContext, useContext, useEffect, useState } from "react";
// helper funtions
import { fetchData } from "./Wrapper.js";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfileState] = useState("business");
  const sUserCitaFix = fetchData("UserCitaFix") ?? [];
  const businessId = sUserCitaFix['BUSSINESS_ID'] ?? "";
  const dorsl = sUserCitaFix['DORSL'] ?? "";

  useEffect(() => {
    // console.log("useEffect -  ProfileContext"); // Borrar
    // const data = {
    //   businessId: businessId,
    //   tipo: true,
    //   dorsl: dorsl
    // };
    // localStorage.setItem("homeBusiness", JSON.stringify(data));
    const stored = localStorage.getItem("profileMode");
    if (stored) setProfileState(stored);
  }, []);

  const setProfile = (mode) => {
    localStorage.setItem("profileMode", mode);
    setProfileState(mode);
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);