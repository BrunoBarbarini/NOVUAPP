import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminAprovacoes from "./pages/admin/AdminAprovacoes";
import AdminCostureiras from "./pages/admin/AdminCostureiras";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminFinanceiro from "./pages/admin/AdminFinanceiro";
import AdminServicos from "./pages/admin/AdminServicos";
import AdminSinistros from "./pages/admin/AdminSinistros";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/pedidos"} component={AdminPedidos} />
      <Route path={"/admin/aprovacoes"} component={AdminAprovacoes} />
      <Route path={"/admin/costureiras"} component={AdminCostureiras} />
      <Route path={"/admin/clientes"} component={AdminClientes} />
      <Route path={"/admin/financeiro"} component={AdminFinanceiro} />
      <Route path={"/admin/servicos"} component={AdminServicos} />
      <Route path={"/admin/sinistros"} component={AdminSinistros} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
