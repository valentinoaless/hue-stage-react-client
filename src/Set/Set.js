import React, { useState, useEffect, useContext } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { set, currentEditorState } from './data'
import StateCreator from './StateCreator.jsx'
import './Set.css'
import { bridge, getBridgeIP } from './bridge'
import SetControls from './set-controls.jsx'
import { State } from './state-model'
import { SetContext } from '../SetContext'
import styled, {keyframes} from 'styled-components';
import { UserContext } from '../UserContext'



function Set() {

  let {globalSetData, setGlobalSetData} = useContext(SetContext);
  let {user, setUser} = useContext(UserContext);

  let setRef = set;
  let [lines, setLines] = useState([...set]);
  let [didLoad, setDidLoad] = useState(false);
  let [message, setMessage] = useState('');
  let [connecting, setConnecting] = useState(false);
  let [connected, setConnected] = useState(false);
  
  const HueState = (props) => {

    const state = props.state

    const style = {
      backgroundColor: `hsl(${state.UIhue}, ${state.UIsat}%, ${(state.UIbri - state.UIsat*state.UIbri/200)}%)`,
      height: '100px',
      width: `${state.duration * 100}px`,
      borderRadius: '5px'
    }

    return (
      <div key={state.id} style={style}></div>
    )

  }

  const Grid = (props) => {

    let states = props.light.gridStates

    return states.map((state,index) => {

      return (

        <Draggable key={`${state.id}-${props.light.name}`} draggableId={state.id} index={index} type="STATE">
          {(provided)=>(
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="draggable-state">
              <HueState key={state.id} state={state}/>
            </div>
          )}
        </Draggable>
      )

    })

  }

  const Light = (props) => {

    const light = props.light

    const style = {
      width: '100px',
      height: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',

    }

    return (
      <div style={style} key={light.id}>
        <h3>{light.name}</h3>
      </div>
    )

  }

  const Line = (props) => {

    const style = {
      display: 'flex',
      borderBottom: '1px solid #2f2f2f',
      backgroundColor: '#222',
      borderRadius: '20px'
    }

    const gridStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100%'
    }

    return (
      <div style={style} >
        <Light light={props.light}/>
        <Droppable droppableId={props.light.id} direction="horizontal" type="STATE">
        {(provided) => (
          <div style={gridStyle} ref={provided.innerRef} {...provided.droppableProps}>
            <Grid light={props.light}/>
            {provided.placeholder}
          </div>
        )}
        </Droppable>
      </div>
    )

  }

  const LineStack = () => {

    return lines.map((light, index) => {

      return (
        <Draggable key={light.name} draggableId={light.id} index={index}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <Line key={light.name} light={light}/>
            </div>
          )}
        </Draggable>

      )

    })

  }

  const SetUpDialog = () => {

    return !connected ? (
      <Background>
        <Modal>
          <div>
            <Connection>set up</Connection>
            {
              connecting ? 
              <>
                <Loading/>
                <Message>{message}</Message>
              </>
              :
              <>
              <ConnectButton onClick={connect}>connect to Hue Bridge</ConnectButton>
              <Later>set up later</Later>
              </>
            }
          </div>
        </Modal>
      </Background>
    ) 
    : 
    <></>

  }


  const onDragEnd = (result) => {

    const {destination, source, draggableId} = result;

    if(!destination) {
      return;
    }

    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if(source.droppableId === "viewer") {
      const newLines = [...lines]
      const light = newLines.find(light => light.id === destination.droppableId)
      const c = currentEditorState;
      let newState = new State(c.UIhue, c.UIsat, c.UIbri, c.transitiontime, c.on, c.duration);
      light.gridStates.splice(destination.index, 0, newState);
      setRef = [...newLines]
      setLines([...newLines])
      return;
    }
    
    if(result.type === "STATE") {
      
      const newLines = [...lines];

      const startingLine = newLines.find(light => light.id === source.droppableId);
      const endingLine = newLines.find(light => light.id === destination.droppableId);

      const draggedState = startingLine.gridStates.find(state => state.id === draggableId)

      startingLine.gridStates.splice(source.index, 1);
      endingLine.gridStates.splice(destination.index, 0, draggedState);

      setRef = [...newLines];
      setLines([...newLines])
      
    } else if (result.type === "LINE") {

      const newLines = [...lines]

      const draggedLine = newLines.splice(source.index, 1)[0];
      newLines.splice(destination.index, 0, draggedLine);
      
      setRef = [...newLines];
      setLines([...newLines]);
      
    }
  
  }

  const connect = async () => {

    setConnecting(true);

    let ip = await getBridgeIP();

    if(ip) {
      console.log(ip);
    } else {
      return null;
    }

    setMessage('press link button on Hue Bridge');

    let {connected, bridgeUser, bridgeIp} = await bridge.connect('');

    console.log(connected, bridgeUser);

    setUser({
      ...user, 
      bridgeUser: bridgeUser,
      bridgeIp: bridgeIp
    })

    console.log('connecting')

    bridge.loadLights(bridgeIp, bridgeUser).then(() => {
      console.log('lights loaded')
      setDidLoad(true);
      setLines([...set]);
    }).catch(err => {
      console.log(err);
    })
    
    setConnected(true);

    return {connected, bridgeUser};

  }




  return (
    <div className="Set">
    <SetUpDialog/>
    <DragDropContext onDragEnd={onDragEnd}>

      <SetControls />
      
      <StateCreator lights={lines} didLoad={didLoad} />

      <Droppable droppableId="linestack" type="LINE">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <LineStack/>
          {provided.placeholder}
        </div>
      )}
      </Droppable>

    </DragDropContext>
      
    </div>
  );
}


export default Set;


let Background = styled.div`
  overflow: hidden;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;

`

let modalAnimation = keyframes`
    0% {
        opacity: 0%;
        transform: translateY(400px);
    }
    100% {
        opacity: 100%;
        transform: translateY(0px);
    }
`

let Modal = styled.div`
    animation-name: ${modalAnimation};
    animation-duration: 300ms;
    animation-iteration-count: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    & > * {
        position: relative;
        width: 30vw;
        height: 25vh;
        border-radius: 10px;
        background-color: #222;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
` 

let Connection = styled.h3`
    margin-bottom: 30px;
    position: absolute;
    top: 30px;

`

let ConnectButton = styled.div`
    background-color: rgba(0,255,255,0.7);
    color: #fff;
    height: 50px;
    width: 200px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
    &:hover {
        background-color: rgba(0,255,255,0.2);
    }
`

let Later = styled.div`
    cursor: pointer;
    &:hover {
      color: #777;
    }
`

let loadingAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
    background-color: deeppink;
  }
  100% {
    transform: scale(1);
  }

`

let Loading = styled.div`
    background-color: cyan;
    position: absolute;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    animation-name: ${loadingAnimation};
    animation-duration: 1s;
    animation-iteration-count: infinite;
`

let Message = styled.h3`
    position: absolute;
    bottom: 50px;
`
