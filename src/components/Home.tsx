import React, { useState } from "react";
import Sidebar from "./common/SideBar";
import Navbar from "./common/ToolBar";
import { Navigate, Route, Routes } from "react-router-dom";
import UsersList from "./auth/UsersList";
import CustomerList from "./customer/CustomerList";
import DriversList from "./drivers/DriversList";
import StoresList from "./store/StoresList";
import SupplierList from "./supplier/SupplierList";
import ProductList from "./product/ProductList";
import DeclarationList from "./declaration/DeclarationList";
import PurchaseList from "./purchase/PurchaseList";
import DeclarationDetail from "./declaration/DeclarationDetail";
import PurchaseDetail from "./purchase/purchaseDetail";
import SalesList from "./sales/SalesList";
import SaleDetail from "./sales/SaleDetail";
import InventoryList from "./inventory/InventoryList";
import CashOfAccountList from "./cash-of-account/CashOfAccountList";
import CATransactionsList from "./ca-transaction/CATransactionsList";
import DashboardHome from "./dashboard/DashboardHome";
import { Container, CssBaseline, styled } from "@mui/material";
import PermissionList from "./auth/PermissionList";
import { hasPermission } from "../utils/checkPermission";
import { PERMISSIONS } from "../core/permissions";
import BanksList from "./bank/bankList";
import { jwtDecode } from "jwt-decode";
import BankDetail from "./bank/bankDetail";
import ProvisionList from "./provision/ProvisionList";
import ExpensesPaymentForm from "./ca-transaction/ExpensesPaymentForm";
import CustomerPaymentList from "./customer/CustomerPaymentList";
import SupplierPaymentList from "./supplier/SupplierPaymentList";
import DriverPaymentList from "./drivers/DriverPaymentList";
import AppLogout from "./AppLogout";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  marginTop: "78px",
  maxWidth: "99%",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    padding: 0,
    maxWidth: "80%",
  }),
}));

const AuthenticatedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // Decode the token to extract expiration time
  const decodedToken = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

  if (decodedToken.exp! < currentTime) {
    // If the token has expired, remove it from local storage
    localStorage.removeItem("accessToken");
    // Redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated and the token is valid, render the element
  return <>{element}</>;
};
interface ProtectedRouteProps {
  element: React.ReactNode;
  permission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  permission,
}) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  // if(!isAuthenticated){
  //   return <Navigate to="/login" replace />;
  // }

  const token = localStorage.getItem("accessToken");

  if (!token) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // Decode the token to extract expiration time
  const decodedToken = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

  if (decodedToken.exp! < currentTime) {
    // If the token has expired, remove it from local storage
    localStorage.removeItem("accessToken");
    // Redirect to the login page
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && hasPermission(permission)) {
    return <>{element}</>;
  } else if (isAuthenticated) {
    // User is authenticated but does not have the required permission
    return <Navigate to="/" replace />;
  } else {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }
};

const Home = () => {
  const [showDrawer, setShowDrawer] = useState(true);

  return (
    <AppLogout>
    <>
      <CssBaseline />
      <Navbar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
    <div style={{ display: "flex" }}>
      <Sidebar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
      <Main open={showDrawer}>
        <Container sx={{margin: 0, maxWidth: "unset"}} maxWidth={false}> 
        <Routes>
          <Route
            path="/users"
            element={
              <ProtectedRoute
                element={<UsersList />}
                permission={PERMISSIONS.GetUsers}
              />
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute
                element={<CustomerList />}
                permission={PERMISSIONS.GetCustomers}
              />
            }
          />
          <Route
            path="/drivers"
            element={
              <ProtectedRoute
                element={<DriversList />}
                permission={PERMISSIONS.GetDrivers}
              />
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute
                element={<StoresList />}
                permission={PERMISSIONS.GetStores}
              />
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute
                element={<SupplierList />}
                permission={PERMISSIONS.GetSuppliers}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute
                element={<ProductList />}
                permission={PERMISSIONS.GetProducts}
              />
            }
          />
          <Route
            path="/declarations"
            element={
              <ProtectedRoute
                element={<DeclarationList />}
                permission={PERMISSIONS.GetDeclarations}
              />
            }
          />
          <Route
            path="/declarations/:id"
            element={
              <ProtectedRoute
                element={<DeclarationDetail />}
                permission={PERMISSIONS.GetDeclarations}
              />
            }
          />
          <Route
            path="/purchases"
            element={
              <ProtectedRoute
                element={<PurchaseList />}
                permission={PERMISSIONS.GetPurchases}
              />
            }
          />
          <Route
            path="/purchases/:id"
            element={
              <ProtectedRoute
                element={<PurchaseDetail />}
                permission={PERMISSIONS.GetPurchases}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute
                element={<SalesList />}
                permission={PERMISSIONS.GetSales}
              />
            }
          />
          <Route
            path="/sales/:id"
            element={
              <ProtectedRoute
                element={<SaleDetail />}
                permission={PERMISSIONS.GetSales}
              />
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute
                element={<InventoryList />}
                permission={PERMISSIONS.GetInventory}
              />
            }
          />
          <Route
            path="/ca-transactions"
            element={
              <ProtectedRoute
                element={<CATransactionsList />}
                permission={PERMISSIONS.GetCaTransactions}
              />
            }
          />
          <Route
            path="/chart-of-accounts"
            element={<AuthenticatedRoute element={<CashOfAccountList />} />}
          />
          <Route
            path="/banks"
            element={<AuthenticatedRoute element={<BanksList />} />}
          />
          <Route
            path="/"
            element={<AuthenticatedRoute element={<DashboardHome />} />}
          />
          <Route
            path="/permissions/:id"
            element={
              <ProtectedRoute
                element={<PermissionList />}
                permission={PERMISSIONS.GetPermissions}
              />
            }
          />
          <Route
            path="/banks/:id"
            element={
              <ProtectedRoute
                element={<BankDetail />}
                permission={PERMISSIONS.GetBanks}
              />
            }
          />
          <Route
            path="/provisions"
            element={
              <ProtectedRoute
                element={<ProvisionList />}
                permission={PERMISSIONS.GetProvisions}
              />
            }
          />
          <Route
            path="/operation-expence-payment"
            element={
              <ProtectedRoute
                element={<ExpensesPaymentForm />}
                permission={PERMISSIONS.CreateCaTransaction}
              />
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute
                element={<CustomerPaymentList />}
                permission={PERMISSIONS.GetCustomerById}
              />
            }
          />
          <Route
            path="/suppliers/:id"
            element={
              <ProtectedRoute
                element={<SupplierPaymentList />}
                permission={PERMISSIONS.GetSupplierById}
              />
            }
          />
          <Route
            path="/drivers/:id"
            element={
              <ProtectedRoute
                element={<DriverPaymentList />}
                permission={PERMISSIONS.GetDriverById}
              />
            }
          />
        </Routes>
        </Container>
      </Main>
    </div>
    </>
    </AppLogout>
  );
};

export default Home;
