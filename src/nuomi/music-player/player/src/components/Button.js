import React from 'react';
import styled from 'styled-components';
import '../resource/iconfont';

export default function Button({_iconName,_color, onClick}){
  const Button = styled.button.attrs({
    type:"button"
  })`
    background-color:transparent;
    border:0 none transparent;
  `

  const SvgIcon = ({className, _iconName}) =>(
    <svg className={className} aria-hidden="true">
      <use xlinkHref={_iconName} ></use>
    </svg>
  )

  const StyledSvgIcon = styled(SvgIcon)`
    width: 3em; 
    height: 3em;
    vertical-align: -0.15em;
    fill: ${props=>props._color};
    overflow: hidden;
  `

  return (
  <Button onClick={onClick}>
    <StyledSvgIcon _iconName={_iconName} _color={_color}/>
  </Button>
  );
}