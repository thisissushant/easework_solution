import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import ActivateSolution from "views/solutions/ActivateSolution/ActivateSolution";
import { element } from "prop-types";
import CategoryID from "views/solutions/MasterData/categoryID/CategoryID";
import CostCenter from "views/solutions/MasterData/costCenter/CostCenter";
import GlAccount from "views/solutions/MasterData/glAccount/GlAccount";
import CategoryCard from "views/solutions/MasterData/categoryCard/CategoryCard";
import SupplierMasterData from "views/solutions/MasterData/suppliermasterdata/SupplierMasterData";
import Contracts from "views/solutions/MasterData/Contracts/Contracts";
import Forms from "views/solutions/MasterData/Forms/Forms";
import Catalogs from "views/solutions/MasterData/Catalogs/Catalogs";



// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("views/dashboard")));

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "solutions",
      children: [
        {
          path: "activateSolution",
          element: <ActivateSolution />,
        },
        {
          path: "masterData",
          children: [
            {
              path: "categoryID",
              element: <CategoryID/>,
            },
            {
              path: "costCenter",
              element: <CostCenter/>,
            },
            {
              path: "glAccount",
              element: <GlAccount/>,
            },
            {
              path: "categoryCard",
              element: <CategoryCard/>,
            },{
              path:"supplierData",
              element:<SupplierMasterData/>
            },{
              path:"contract",
              element:<Contracts/>
            },{
              path:"forms",
              element:<Forms/>
            },{
              path:"catalog",
              element:<Catalogs/>
            },
           
           
          ]
        },
      ],
    },
  ],
};

export default MainRoutes;
