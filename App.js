import { StatusBar } from 'expo-status-bar';
import React, {  useLayoutEffect,useState, useRef } from 'react';
import {  TouchableOpacity, Button, ActivityIndicator, Dimensions, Platform} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import styled from "styled-components/native"
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

const {width, height} = Dimensions.get("window");
const ALBUM_NAME='Hello Cam'


export default function App() {

  const cameraRef = useRef()
  const [hasPermission, setHasPermission] = useState(null);
  const [smileDetected, setSmileDetected] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.back);



  const handleChangeType = () => {
    setType(prev => prev === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
  }

  const takePhoto = async () =>{
    try {
      const {uri} = await cameraRef.current.takePictureAsync({
        quality:1, 
      });
      if(uri){
        savePhoto(uri)
      }
    } catch (error) {
      alert(error)
      setSmileDetected(false)
    }  
  }

  const savePhoto = async (uri) => {
    try {
      console.log(uri)
      const {status} = await MediaLibrary.requestPermissionsAsync()
      if(status === "granted"){
        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
        if(album === null){
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset)
        }else{
            await MediaLibrary.addAssetsToAlbumAsync([asset], album.id)
        }
        setTimeout(()=>{
          setSmileDetected(false)
        },1000)
      }else{
        setHasPermission(false)
      }
    } catch (error) {
      
    }
  }

  const handleFaceDetect = async ({faces}) => {
    const face = faces[0]
    console.log("take")
    if(face){
      if(face.smilingProbability > 0.7){
        setSmileDetected(true)
        takePhoto();
      }
    }
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
      {hasPermission === false ? (
        <Text> No Permissions</Text>
      ) : hasPermission  ? 
      (
        (
          <>
          <Camera 
            ref={cameraRef}
            type={type}
            style={
              {
                width : width- 40,
                height:height / 1.5,
                borderRadius:10,
                overflow:'hidden'}
            } 
            onFacesDetected={smileDetected ? null : handleFaceDetect}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all,
              minDetectionInterval: 500,
              tracking: true,
            }}
          />
          <TouchableOpacity onPress={handleChangeType}>
            <IconBar >
                <MaterialIcons 
                  name={
                    type === Camera.Constants.Type.front ? "camera-rear" : "camera-front"
                  }
                  color="white"
                  size={50}
                />
            </IconBar>
          </TouchableOpacity>
          <Button title="snap"/>
          </>
        ) 
      )
      : (<ActivityIndicator/>)}
        <StatusBar style="auto" />
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

const IconBar = styled.View`
  margin-top:40;
`

