// Library
import { ToastContainer } from 'react-toastify';
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";

// Layouts
import Main from "./layouts/Main.jsx";
import { ProfileProvider } from "./ProfileContext.jsx";

// Routers
import ViewUpdateBusiness, { viewUpdateBusinessLoader } from "./pages/register_business/View_update_business.jsx";
import LoginForm, { loginFormLoader } from "./pages/Login";
import SingIn from './pages/authenticate/SignIn.jsx';
import Error from "./pages/Error.jsx";
import BusinessCalendar from './pages/business/BusinessCalendar.jsx';
import Workspaces from './pages/business/Workspaces.jsx';
import RegisterBusiness, { registerBusinessLoader } from './pages/register_business/Register_business.jsx';
import UpdateAppoinBusiness, { UpdateAppoinLoader } from './pages/appoinment/Update_appoin_business.jsx';
import ViewBusiness, { ViewBusinessLoader } from './pages/business/View_business.jsx';
import UpdateSpace, {UpdateSpaceLoader} from './pages/register_business/UpdateSpace.jsx';
import ViewUpdateUser from './pages/user/View_update_user.jsx';
// Actions
import { logoutAction } from "./actions/logout.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    // loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <LoginForm />,
        loader: loginFormLoader,
        errorElement: <Error />
      },
      {
        path: "login",
        element: <SingIn />,
        // loader: loginLoader,
        /* action: findBusinessAction, */
        errorElement: <Error />
      },
      {
        path: "home",
        element: <BusinessCalendar />,
        // loader: homeLoader,
      },
      {
        path: "workspaces",
        element: <Workspaces />,
        // loader: homeLoader,
      },
      {
        path: "viewUpdateBusiness",
        element: <ViewUpdateBusiness />,
        loader: viewUpdateBusinessLoader,
        /* action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "registerBusiness",
        element: <RegisterBusiness />,
        loader: registerBusinessLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "updateAppoinBusiness/:id",
        element: <UpdateAppoinBusiness />,
        loader: UpdateAppoinLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "updateSpace",
        element: <UpdateSpace />,
        loader: UpdateSpaceLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "viewBusiness",
        element: <ViewBusiness />,
        loader: ViewBusinessLoader,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "viewUpdateUser",
        element: <ViewUpdateUser />,
        /*action: expensesAction, */
        errorElement: <Error />
      },
      {
        path: "logout",
        action: logoutAction
      },

    ]
  }
]);

function App() {
  return (
    <ProfileProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ProfileProvider>
  );
}

export default App;
