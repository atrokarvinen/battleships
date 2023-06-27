import { Provider } from "react-redux";
import { DarkModeWrapper } from "./dark-mode-wrapper";
import SocketProvider from "./io/socketProvider";
import { store } from "./redux/store";
import Routing from "./routing";

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
