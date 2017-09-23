import React from 'react';
import styled from 'styled-components';
import '../resource/iconfont';
import Button from './Button';
import * as Directive from '../types/Directive'

export default function Controler(props){
  const Container = styled.div`
    display:flex;
    flex-direction: column;
    justify-content : space-around;
    align-items:center;
  `

  const Progress = styled.div`
    display:flex;

  `

  const OtherControler = styled.div`
    width:300px;
    display:flex;
    justify-content:space-around;
    align-items:center;
  `

  const loopMap = {
    listLoop:"#icon-xunhuanbofang",
    singleLoop:"#icon-danquxunhuan",
    listOnce:"#icon-iconfontttpodicon1eps",
    random:"#icon-suijibofang"
  }


  const getLoopStateIcon = ()=>{
    return loopMap[props.state.loopState]
  }

  return (
  <Container>
    <Progress id="progress"></Progress>
    <OtherControler id="btns">
      <Button _iconName={getLoopStateIcon()} 
              _color="green"
              onClick={()=>props._directive(Directive.TOGGLE_LOOP)}/>
      <Button _iconName="#icon-prev" 
              _color="green"
              onClick={()=>props._directive(Directive.PRE_SONG)}></Button>

      <Button _iconName={props.state.play?"#icon-zanting":"#icon-bofangqi3"}
              _color="green"
              onClick={()=>props._directive(Directive.TOGGLE_PLAY)}
              />
      <Button _iconName="#icon-nextvideo-copy" 
              _color="green"
              onClick={()=>props._directive(Directive.NEXT_SONG)}
              />
      <Button _iconName="#icon-liebiao" 
              _color="green"
              onClick={()=>props._directive(Directive.SHOW_SONG_LIST)}
              />

    </OtherControler>
  </Container>
  )

}