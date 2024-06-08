import React, { useState } from 'react';
import Dialog from 'react-native-dialog';
import { useAppSelector } from '../../hooks/reduxHooks';
import {Picker} from '@react-native-picker/picker';



type DownloadDialogProps = {
  visible: boolean;
  handleServer: (name: string) => void;
  setDownloadDialog: (visible: boolean) => void;
};
export const ServerDialog = ({
  visible,
  handleServer,
  setDownloadDialog,
}: DownloadDialogProps) => {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [serverAuth, setServerAuth] = useState('');
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [selectedLServerType, setSelectedServerType] = useState();
  const [selectedLAuthType, setSelectedAuthType] = useState();
  return (
    <Dialog.Container
      contentStyle={{ backgroundColor: colors.background2 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: colors.primary }}>
        Enter Your Server Details
      </Dialog.Title>

      <Picker  
      dropdownIconColor='white'
      dropdownIconRippleColor='white'
      style={{ backgroundColor: 'black', color: 'white' }}
       // Set background color to black
      //  itemStyle={{ backgroundColor: "grey", color: "white", fontFamily:"Ebrima", fontSize:17 }}
  selectedValue={selectedLServerType}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedServerType(itemValue)
  }>
  <Picker.Item label="HTTP" value="http"   />
  <Picker.Item label="FTP (upcoming)" value="ftp"  enabled={false} />
</Picker>

      <Dialog.Input
        style={{ color: colors.primary }}
        value={downloadUrl}
        onChangeText={(text) => setDownloadUrl(text)}
      ></Dialog.Input>
      <Picker  
      dropdownIconColor='white'
      dropdownIconRippleColor='white'
      style={{ backgroundColor: 'black', color: 'white' }}
       // Set background color to black
      //  itemStyle={{ backgroundColor: "grey", color: "white", fontFamily:"Ebrima", fontSize:17 }}
  selectedValue={selectedLAuthType}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedAuthType(itemValue)
  }>
  <Picker.Item label="USERNAME : PASSWORD" value="username_password" />
</Picker>
<Dialog.Input
        style={{ color: colors.primary }}
        value={serverAuth}
        onChangeText={(text) => setServerAuth(text)}
      ></Dialog.Input>
      
      <Dialog.Button
        label="Cancel"
        onPress={() => {
            setDownloadDialog(false);
          setDownloadUrl('');
        }}
      />
      <Dialog.Button
        label="OK"
        onPress={() => {
          handleServer(downloadUrl, serverAuth);
          setDownloadDialog(false);
          setDownloadUrl('');
          setServerAuth('');
        }}
      />
    </Dialog.Container>
  );
};
