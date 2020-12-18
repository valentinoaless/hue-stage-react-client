import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import { set } from './data'
import { bridge } from './bridge'
import { SetContext } from '../SetContext';

// play button
// pause button
// tempo

// i.e. tempo = 140, beat happens at second measure (4 beats)

// 1 measure has x beats
// measure length in ms = /

// tempo == beats in 60s
let tempo = 120;
let beatsPerMeasure = 4;
let beatValue = 4; // 1/4 (quarter)

// get current time and every 50 ms check what objects have a play time before current time

// after copying state and sending, delete those objects from the play time


// render all states 
// when rendering states, make an array with objects
// each object will have two properties, playTime and an array of all the states



//disable all controls and dnd interface

/*


*/

const SetControls = () => {
    
    let {globalSetData, setGlobalSetData} = useContext(SetContext);

    console.log(globalSetData);

    let stopButtonPressed = {state: false};
    let [stopped, setStopped] = useState(false);
    let [playing, setPlaying] = useState(false);
    console.log(stopped);
    
    const play = () => {

        if(!playing) {

            setPlaying(true);

            let playerQueues = [];
        
            set.map(light => {

                let millisecondOcurrence = 0;

                light.gridStates.map(state => {

                    let millisecondDuration = ((60000/tempo) * beatsPerMeasure) * state.duration
                    
                    playerQueues.push({
                        occurrenceTime: millisecondOcurrence,
                        properties: {
                            state: state,
                            bridgeIndex: light.bridgeIndex
                        }
                    })
                    
                    millisecondOcurrence += millisecondDuration;

                })

            })

            let startTime = new Date()

            let player = setInterval(()=>{

                let currentTime = new Date()
                let elapsedTime = currentTime - startTime;
                let queueCopy = [...playerQueues]

                let messages = queueCopy.filter(state => {
                    return state.occurrenceTime <= elapsedTime
                });

                messages.map(message => {
                    bridge.send(message.properties.bridgeIndex, message.properties.state.data())
                    //console.log(message.properties.state, message.properties.bridgeIndex)
                })
                
                playerQueues = queueCopy.filter(state => state.occurrenceTime > elapsedTime );


                console.log(stopButtonPressed.state)

                if(playerQueues.length === 0 || stopButtonPressed.state) {
                    stopButtonPressed.state = false;
                    setPlaying(false);
                    setStopped(false);
                    clearInterval(player);
                }

            }, 50)

        } 

    }

    const stop = () => {

        if(!stopped) {

            stopButtonPressed.state = true;
            setStopped(true);
            console.log(stopped)
            setPlaying(false);
        }

    }

    const handleChange = (e) => {
        
        if(e.target.name === "tempo") {
            if(e.target.value >= 60 && e.target.value <= 240) {
                globalSetData.tempo = Number(e.target.value);
                console.log(e.target.value);
            } else {
                e.target.value = 120;
            }

        }

    }


    return (
        <Controls>
            {
                /* globalSetData.timeMethod === "tempo" ?
                <Tempo></Tempo>
                :
                <></> */
            }
            <Tempo name="tempo" type="number" min="60" max="240" defaultValue={globalSetData?.tempo || 120} onBlur={handleChange}/>
            <div>
                <Play playing={playing} onClick={play}>&#xFE0E;&#9654;&#xFE0E;</Play>
                <Stop onClick={stop}/>
            </div>
        </Controls>
    );
};

export default SetControls;

const Controls = styled.div`
    color: white; 
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    background-color: #222;
    margin: 5px;
    & > * {
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
`

const Play = styled.div`
    width: 20px;
    height: 20px;
    margin: 20px;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
    :hover {
        color: green;
    }
`

const Stop = styled.div`
    width: 20px;
    height: 20px;
    margin: 20px;
    cursor: pointer;
    background-color: white;
    :hover {
        background-color: red;
    }
    :active {
        background-color: darkred;
    }
`

const Tempo = styled.input`
    width: 80px;
    height: 20px;
    border: none;
    color: white;
    font-size: 1.3rem;
    background-color: #222;
    padding: 20px;
    &:focus {
        outline: none;
    }
`