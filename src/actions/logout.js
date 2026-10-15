// rrd imports
import { redirect } from "react-router-dom";

// helers 
import { deleteItem } from "../Wrapper.js";

// Library
import { toast } from "react-toastify";

export async function logoutAction(){
    // delete tha user
    deleteItem({ key: "correo"});
    deleteItem({ key: "pwd"});
    deleteItem({ key: "dorsl"});
    deleteItem({ key: "UserCitaFix"});
    // localStorage.removeItem("profileMode");
    window.dispatchEvent(new Event("authChanged"));
    // localStorage.setItem("hasSeenSearchIndicator", JSON.stringify("Indicator"));
    toast.success("Regresa pronto!");
    // return redirect
    return redirect("/");
}