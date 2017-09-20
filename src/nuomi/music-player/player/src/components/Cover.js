import React from 'react';
import styled from 'styled-components';

export default function Cover(props){
  const Container = styled.div`
    display:flex;
    flex-direction: column;
    justify-content : space-around;
    align-items:center;
  `

  const CoverPic = styled.img`
    max-width:300px;
    max-height:300xp;
    
  `

  return (
  <Container>
    <CoverPic src="http://placeholder.qiniudn.com/300x300"/>
  </Container>
  )

}