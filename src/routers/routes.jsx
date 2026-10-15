import { Routes, Route } from "react-router-dom";
// Layouts
import Main, { mainLoader } from "../layouts/Main.jsx";
// Routers
import Home from "../pages/Home.jsx";
import ViewUpdateUser from "../pages/register_user/View_update_user.jsx";
import ViewUpdateBusiness from "../pages/register_business/View_update_business.jsx";
import FindBusiness from "../pages/business/Find_business.jsx";
import Notification from "../pages/Notification.jsx";
import RegisterUser from "../pages/register_user/Register_user.jsx";
import LoginForm from "../pages/Login";
import Error from "../pages/Error.jsx";

export function MyRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Main/>} loader={mainLoader} errorElement={<Error/>}/>
            <Route path="/login" element={<LoginForm/>} errorElement={<Error/>} />
            <Route path="/home" element={<Home />} errorElement={<Error/>} />
            <Route path="/registerUser" element={<RegisterUser />} errorElement={<Error/>}/>
            <Route path="/viewUpdateUser" element={<ViewUpdateUser />} errorElement={<Error/>}/>
            <Route path="/findBusiness" element={<FindBusiness />} errorElement={<Error/>}/>
            <Route path="/viewUpdateBusiness" element={<ViewUpdateBusiness />} errorElement={<Error/>} />
            <Route path="/notification" element={<Notification />} errorElement={<Error/>} />
        </Routes>
    );
}