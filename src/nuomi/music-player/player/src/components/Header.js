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
    <Info fs="18px">NonStop!Journey</Info>
    <Info fs="12px">Goose house</Info>
  </Container>
  )

}