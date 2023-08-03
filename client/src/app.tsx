import { Provider } from "react-redux";
import SocketProvider from "./io/socketProvider";
import { store } from "./redux/store";
import Routing from "./routing";
import ThemeProvider from "./theme/themeProvider";

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider>
          <Routing />
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
}

export default App;
