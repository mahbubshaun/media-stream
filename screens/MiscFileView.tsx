import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

import Constants from 'expo-constants';

import { useAppSelector } from '../hooks/reduxHooks';
import { StackScreenProps } from '@react-navigation/stack';
import { PDFViewer } from '../components/MiscFileView/PDFViewer';
import RNFS from 'react-native-fs';
import App from './Appvv'; 
type MiscFileViewParamList = {
  MiscFileView: { prevDir: string; folderName: string };
};

type Props = StackScreenProps<MiscFileViewParamList, 'MiscFileView'>;

const MiscFileView = ({ route }: Props) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { prevDir, folderName } = route.params;
  const fileExt = folderName.split('/').pop().split('.').pop().toLowerCase();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [showWebViewAgain, setShowWebViewAgain] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');


  const handleShowWebViewAgain = () => {
    setVideoUrl('');
    setShowWebViewAgain(true);

  };
  useEffect(() => {
    if (fileExt === 'txt') {
      const filePath = prevDir + '/' + folderName;

      RNFS.readFile(filePath, 'utf8')
        .then(content => {
          setFileContent(content);
        })
        .catch(error => {
          console.error('Error reading file:', error);
        });
    }
  }, [fileExt, prevDir, folderName]);


  if (fileExt === 'pdf')
    return <PDFViewer fileURI={prevDir + '/' + folderName} />;
    const handleLinkPress = (url: string) => {
      // Linking.openURL(url);
      setVideoUrl(url);
    setShowWebViewAgain(false);
    };
  
    const renderContent = () => {
      if (fileExt === 'pdf') {
        return <PDFViewer fileURI={prevDir + '/' + folderName} />;
      }
  
      if (fileContent !== null) {
        const words = fileContent.split(' ');
  
        return (
          <Text style={{ color: colors.primary }}>
            {words.map((word, index) => (
              <Text key={index} onPress={() => handleLinkPress(word)}>
                {index > 0 ? ' ' : ''}{word}
              </Text>
            ))}
          </Text>
        );
      }
  
      return (
        <Text style={{ color: colors.primary }}>
          This file format is not supported.
        </Text>
      );
    };
  


      return (
        <>
        {showWebViewAgain ? (
          <View style={{ ...styles.container, backgroundColor: colors.background }}>
          {renderContent()}
        </View>
        ) : (
          <App
            videoUri={videoUrl}
            showWebViewAgain={handleShowWebViewAgain}
            // titleName={name}
          />
        )}
        </>
       );
    };

export default MiscFileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
