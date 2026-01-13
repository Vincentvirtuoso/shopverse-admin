import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SetupCheck from "./components/SetupCheck";

const App = () => {
  return (
    <SetupCheck>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </SetupCheck>
  );
};

export default App;
