import { useAuth } from "./context/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HeaderProfile from "./components/Profile/HeaderProfile";
import Footer from "./components/Footer/Footer";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {user ? <HeaderProfile /> : <Header />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
