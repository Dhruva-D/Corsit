import { useAuth } from "./context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import HeaderProfile from "./components/Profile/HeaderProfile";
import Footer from "./components/Footer/Footer";
import EnhancedSpaceBackground from "./components/Particles/EnhancedSpaceBackground";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideHeaderRoutes = ["/expo25-feedback"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      <EnhancedSpaceBackground />
      {!shouldHideHeader && (user ? <HeaderProfile /> : <Header />)}
      <main className="min-h-screen relative z-10">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
