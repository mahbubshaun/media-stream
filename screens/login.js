import LoginScreen from "react-native-login-screen";

const [username, setUsername] = React.useState('');
const [password, setPassword] = React.useState('');

<LoginScreen
  logoImageSource={require('./assets/logo-example.png')}
  onLoginPress={() => {}}
  onSignupPress={() => {}}
  onEmailChange={setUsername}
  onPasswordChange={setPassword}
  enablePasswordValidation
/>