import { Provider } from "react-redux";
import SocketProvider from "./io/socketProvider";
import { store } from "./redux/store";
import Routing from "./routing";
import { DarkModeWrapper } from "./theme/dark-mode-wrapper";

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <DarkModeWrapper>
          <Routing />
        </DarkModeWrapper>
      </SocketProvider>
    </Provider>
  );
}

export default App;
