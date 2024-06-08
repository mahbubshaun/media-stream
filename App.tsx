import 'react-native-gesture-handler';
import React, { useState, useContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import Main from './screens/Main';
import { store } from './store';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthStack } from './navigation/AuthStack';
import { NavigationContainer ,  DarkTheme,
  DefaultTheme,} from '@react-navigation/native';
import { AuthenticatedUserContext } from './providers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config';
import { LoadingIndicator } from './components';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { setLightTheme, setDarkTheme } from './features/files/themeSlice';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';


// const App = () => {
  
//   return (
//     <SafeAreaProvider>
//       <Provider store={store}>
//         <AuthenticatedUserProvider>

//           <NavigationContainer >
//           <Main />

//             {/* <AuthStack /> */}
//             {/* {user ? 
//       <Main />
//  : <AuthStack />} 
//           */}

//             {/* <Main /> */}
//           </NavigationContainer>
//         </AuthenticatedUserProvider>
//       </Provider>
//     </SafeAreaProvider>
//   );
// };
const App = () => {
  return (
    <Provider store={store}>
      <AutocompleteDropdownContextProvider>
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
      <Main />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
    </AutocompleteDropdownContextProvider>
    </Provider>
  );
};


export default App;
