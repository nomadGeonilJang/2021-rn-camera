import { StatusBar } from 'expo-status-bar';
import React, {  useLayoutEffect,useState, useRef } from 'react';
import {  View , TouchableOpacity, Button, ActivityIndicator} from 'react-native';
import { Camera } from 'expo-camera';
import styled from "styled-components/native"

export default function App() {

  const cameraRef = useRef()
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);



  const handleSnap = async () => {
    const snap = await cameraRef.current.takePictureAsync();
    console.log(snap)
  }


  useLayoutEffect(()=>{
    (async()=>{
      const { status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  },[])

  if (hasPermission === null) {
    return <ActivityIndicator/>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <CenterView >
      {hasPermission !== true ? (
        <Text> No Permissions</Text>
      ) : hasPermission !== false ? 
      (
        (
          <>
          <Camera ref={cameraRef} type={type} >
            <View >
              <TouchableOpacity
                onPress={() => {
                  console.log(Camera.Constants.Type.front)
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}>
                <Text> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
              <Button title="snap"/>
              <StatusBar style="auto" />
          </>
        ) 
      )
      : (<ActivityIndicator/>)}
    
       </CenterView>
  );
}

const CenterView = styled.View`
  flex:1;
  align-items:center;
  justify-content:center;
  background-color:cornflowerblue;
`

const Text = styled.Text`
  color:purple;

`

