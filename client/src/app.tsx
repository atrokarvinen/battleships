import { Provider } from "react-redux";
import SocketProvider from "./io/socketProvider";
import ToastObserver from "./notification/toastObserver";
import { store } from "./redux/store";
import Routing from "./routing";
import ThemeProvider from "./theme/themeProvider";

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider>
          <ToastObserver />
          <Routing />
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
}

export default App;
