import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import Sett from './settings';

const MultiUrlInput = () => {
  const [credentials, setCredentials] = useState([
    { url: '', username: '', password: '' },
  ]);

  const handleInputChange = (index, field, value) => {
    const newCredentials = [...credentials];
    newCredentials[index][field] = value;
    setCredentials(newCredentials);
  };

  const addUrlInput = () => {
    setCredentials([...credentials, { url: '', username: '', password: '' }]);
  };

  return (
    <Sett> </Sett>
    // <View>
    //   {credentials.map((credential, index) => (
    //     <View key={index}>
    //       <TextInput
    //         placeholder="URL"
    //         value={credential.url}
    //         onChangeText={(value) => handleInputChange(index, 'url', value)}
    //       />
    //       <TextInput
    //         placeholder="Username"
    //         value={credential.username}
    //         onChangeText={(value) => handleInputChange(index, 'username', value)}
    //       />
    //       <TextInput
    //         placeholder="Password"
    //         secureTextEntry
    //         value={credential.password}
    //         onChangeText={(value) => handleInputChange(index, 'password', value)}
    //       />
    //     </View>
    //   ))}
    //   <Button title="Add URL" onPress={addUrlInput} />
    // </View>
  );
};

export default MultiUrlInput;
