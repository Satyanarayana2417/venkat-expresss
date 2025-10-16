import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BottomNavbar } from "./components/BottomNavbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import FoodItems from "./pages/FoodItems";
import DecorativeItems from "./pages/DecorativeItems";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import Branch from "./pages/Branch";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import TrackOrder from "./pages/TrackOrder";
import ProhibitedItems from "./pages/ProhibitedItems";

const queryClient = new QueryClient();

// Layout component to handle conditional header display
const Layout = () => {
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';
  const isProfilePage = location.pathname === '/dashboard' || location.pathname === '/home';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isFoodOrDecorativePage = location.pathname === '/food-items' || location.pathname === '/decorative-items';
  const isProductsPage = location.pathname === '/products';
  const isServicesPage = location.pathname === '/services';
  const isProhibitedPage = location.pathname === '/prohibited';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide Header on mobile for cart, profile, admin, food items, decorative items, products, services, and prohibited items pages */}
      {!isAdminPage && (
        <div className={(isCartPage || isProfilePage || isFoodOrDecorativePage || isProductsPage || isServicesPage || isProhibitedPage) ? 'absolute -top-[9999px] md:relative md:top-0' : ''}>
          <Header />
        </div>
      )}
      <main className={isAdminPage ? 'flex-1' : 'flex-1 pb-20 md:pb-0'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/food-items" element={<FoodItems />} />
          <Route path="/decorative-items" element={<DecorativeItems />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-legacy" element={<Admin />} />
          <Route path="/admin/*" element={<AdminAuth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/prohibited" element={<ProhibitedItems />} />
          <Route path="/track-order" element={<TrackOrder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && (
        <div className={(isFoodOrDecorativePage || isProductsPage || isCartPage || isProfilePage) ? 'hidden md:block' : ''}>
          <Footer />
        </div>
      )}
      {/* Hide BottomNavbar on cart, profile, and admin pages */}
      {!isAdminPage && (
        <div className={(isCartPage || isProfilePage) ? 'hidden md:block' : ''}>
          <BottomNavbar />
        </div>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" />
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
