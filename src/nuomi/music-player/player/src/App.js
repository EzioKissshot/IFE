import React, { Component } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Cover from './components/Cover';
import Controler from './components/Controler'
import './App.css';
import * as Directive from './types/Directive'
import {log, getRandomInt} from './utils/Utils'
import Songs from './data/Song'

export default (() => {

  const Container = styled.div`
    width:900px;
    height:100%;
    background-color:#eee;
    margin: 0 auto;
    display:flex;
    flex-direction:column;4
    justify-content:space-between;
    align-items:center;

  `


  return class App extends Component{

    constructor(props){
      super(props)
      this.loopState = {listLoop:"listLoop",}
      this.state = {
        play:false,
        loopState:this.loopState.listLoop,
        volumn:1,
        songs:Songs,
        currentSongIndex:1,
        currentTime:0,
        

      }
    }

    componentWillUpdate(nextProps, nextState){
      // log('update')
      // log('State'+this.state.play)
      // log('nextState'+nextState.play)
      
    }

    componentDidUpdate(prevProps, prevState){
      log('isPlayBefore:'+prevState.play)
      log('isPlayAfter:'+this.state.play)
      const isChanged = this.getIsChanged(prevState)
      if(isChanged("play")||isChanged("currentSongIndex")){
        log("isChanged"+isChanged("play"))
        log(this.state.play);
        if(this.state.play){
          log("startplay")
          this.music.play()
        }else{
          log("startpause")
          this.music.pause();
        }
      }
    }

    getIsChanged(anotherState){
      return (prop)=>{
        return anotherState[prop]!==this.state[prop];
      }
    }

    directive(order){
      switch (order){
        case Directive.TOGGLE_PLAY:
          this.setState((prevState, props)=>({play:!prevState.play}))
          break;
        case Directive.NEXT_SONG:
          this.readyForNextSong(true, true)
          this.setState({play:true})
          break;
        case Directive.PRE_SONG:
          this.readyForNextSong(true, false)
          this.setState({play:true})
          break;
        case Directive.TOGGLE_LOOP:
          // now we only have one type loop
          break;
        case Directive.SHOW_SONG_LIST:
          //TODO: show list
          break;
        default:
          log('unhandle directive!')

      }

       
    }



    getNextSongObj(){
      if(this.state.currentSongIndex < this.state.songs.length - 1){
        const nextSong = this.state.songs[this.state.currentSongIndex+1]
        return nextSong;
      }
      return null;
    }

    getPreSongObj(){
      if(this.state.currentSongIndex > 0){
        const preSong = this.state.songs[this.state.currentSongIndex-1]
        return preSong 
      }
      return null;
    }

    readyForNextSong(isManually, isNext){
      const {listLoop, listOnce, singleLoop, random} = this.loopState;
      switch(this.state.loopState){
        case listLoop:
          let nextSong;
          if(isNext){
            if((nextSong = this.getNextSongObj())!==null){
              this.setState((prevState)=>({currentSongIndex:prevState.currentSongIndex+1}))
            }else{
              this.setState({currentSongIndex:0})
            }

          }else{
            if((nextSong= this.getPreSongObj())!==null){
              this.setState((prevState)=>({currentSongIndex:prevState.currentSongIndex-1}))
            }else{
              this.setState({currentSongIndex:this.state.songs.length-1})
            }
          }
          break;

        default:
          throw new Error("Unhandled loopState")
      }
    }

    onPlayingRecover(){
      log("Plyaing Recover")
    }

    showErrorMsg(e){
      log(e)
    }

    onPause(){
      log("Pause")
      this.setState({play:false})
    }
    
    updateProgress(){
      log("update Progress")
    }

    onSongEnd(){
      log("song end")
      this.readyForNextSong(false, true)
      this.setState({play:true})
    }

    
    render(){
      return(
        <Container id="container">
          <audio src={this.state.songs[this.state.currentSongIndex].src}
          id="music"
          ref={audio=>this.music=audio}
          onPlaying={this.onPlayingRecover.bind(this)}
          onEnded={this.onSongEnd.bind(this)}
          onError={this.showErrorMsg.bind(this)}
          onPause={this.onPause.bind(this)}
          onProgress={this.updateProgress.bind(this)}
          onCanPlay={()=>{log("can play")}}
          
           >亲 您的浏览器不支持html5的audio标签</audio>
          <Header id="p-header" song={this.state.songs[this.state.currentSongIndex]}/>
          <Cover id="p-cover" song={this.state.songs[this.state.currentSongIndex]}/>
          <Controler id="p-controler" _directive={this.directive.bind(this)} state={this.state}/>
        </Container>
      );
    }
  }
})();

