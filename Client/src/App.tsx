// import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./Project/redux/auth/store";
// import { router } from "./Project/Routes";
// import InitializedAuth from "./Project/auth/initializedAuth";


// function App() {
//   return (
//     <Provider store={store}>
//       <InitializedAuth>
//         <RouterProvider router={router} />
//       </InitializedAuth>
//     </Provider>
//   );
// }

//export default App;
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./Project/redux/auth/store";
import { router } from "./Project/Routes";
import InitializedAuth from "./Project/auth/initializedAuth";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InitializedAuth>
          <RouterProvider router={router} />
        </InitializedAuth>
      </PersistGate>
    </Provider>
  );
}

export default App;