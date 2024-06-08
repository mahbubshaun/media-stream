import React, { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, ActivityIndicator  } from 'react-native';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';
import { AuthenticatedUserContext } from '../providers';
import { onAuthStateChanged } from 'firebase/auth';


export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const { user, setUser } = useContext(AuthenticatedUserContext);
  console.log(user);
  useEffect(() => {

    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);

      }
    );

    // unsubscribe auth listener on unmount
    console.log(user);
    if (user)
    {
      console.log("Already logged in!"); // Print something if login succeeds

    }

    return unsubscribeAuthStateChanged;
  }, [user]);
  console.log(user);
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  console.log('in login screen');

  const handleLogin = values => {
    const { email, password } = values;
    setLoading(true); // Set loading state to true when login starts
    signInWithEmailAndPassword(auth, email, password).then(() => {
      setLoading(false); // Set loading state to false when login succeeds
      // navigation.navigate('SettingsMain');
    })
    .catch(error => {
      setLoading(false); // Set loading state to false when login fails
      setErrorState(error.message);
    });
  };
  return (
    <>
      {loading ? ( // Render activity loader when loading state is true
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.orange} />
        </View>
      ) :
      (
        <>

{user ? (
      navigation.navigate('SettingsMain')
    ) : (
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.logoContainer}>
            <Logo uri={Images.logo} style={styles.logo} />
            <Text style={styles.screenTitle}>Welcome back!</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur
            }) => (
              <>
                <TextInput
                  name='email'
                  leftIconName='email'
                  placeholder='Enter email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='Enter password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='password'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Create a new account?'}
            onPress={() => navigation.navigate('Signup')}
          />
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Forgot Password'}
            onPress={() => navigation.navigate('ForgotPassword')}
          />
        </KeyboardAwareScrollView>
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            Expo Firebase Starter App (based on managed workflow)
          </Text>
        </View> */}
      </View>
    )}


      

      {/* App info footer */}

      </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#31364A',
    height: '100%',
    paddingHorizontal: 12
  },
  logoContainer: {
    borderRadius: 40, // Add borderRadius property
    marginTop: 40,
    alignItems: 'center'

  },
  logo: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    borderRadius: 50, // Same value as the container's borderRadius
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    paddingTop: 20
  },
  footer: {
    backgroundColor: '#31364A',
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.orange
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    color: Colors.white,
    justifyContent: 'center'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31364A'
  },
});
