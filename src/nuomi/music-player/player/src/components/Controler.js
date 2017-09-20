import React from 'react';
import styled from 'styled-components';

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

  const ControlBtn = styled.button`
    height:50px;
    width:50px;
    background-image:url(${props=> props.imgUrl})
  `



  return (
  <Container>
    <Progress id="progress"></Progress>
    <OtherControler id="btns">
      <ControlBtn imgUrl="http://placeholder.qiniudn.com/50x50"></ControlBtn>
      <ControlBtn imgUrl="http://placeholder.qiniudn.com/50x50"></ControlBtn>
      <ControlBtn imgUrl="http://placeholder.qiniudn.com/50x50"></ControlBtn>
      <ControlBtn imgUrl="http://placeholder.qiniudn.com/50x50"></ControlBtn>
      <ControlBtn imgUrl="http://placeholder.qiniudn.com/50x50"></ControlBtn>
    </OtherControler>
  </Container>
  )

}