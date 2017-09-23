import React from 'react';
import styled from 'styled-components';

export default function Header(props){
  const Container = styled.div`
    display:flex;
    flex-direction: column;
    justify-content : space-around;
    align-items:center;
  `

  const Info = styled.span`
    font-size:${props=>props.fs}
  `

  return (
  <Container>
    <Info fs="18px">{props.song.name}</Info>
    <Info fs="12px">{props.song.singer}</Info>
  </Container>
  )

}