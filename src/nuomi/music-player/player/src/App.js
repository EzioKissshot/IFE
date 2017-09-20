import React, { Component } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Cover from './components/Cover';
import Controler from './components/Controler'
import './App.css';

export default (() => {

  const Container = styled.div`
    width:900px;
    height:100%;
    background-color:#eee;
    margin: 0 auto;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;

  `


  return class App extends Component{
    render(){
      return(
        <Container id="container">
          <Header id="p-header"/>
          <Cover id="p-cover"/>
          <Controler id="p-controler"/>
        </Container>
      );
    }
  }
})();

