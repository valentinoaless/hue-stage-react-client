import React, { useState } from 'react';
import './StateCreator.css';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import { currentEditorState } from './data'
import { bridge } from './bridge.js';
import { set } from './data';
import { State } from './state-model';

const ViewerContainer = styled.div`
        position: absolute;
        width: 50px;
        height: 50px;
        :active {
            width: ${props => props.duration}px;
            height: 50px;
        }
        overflow: hidden;
`;



const NewState = styled.div`
    position: fixed;
    right: 0;
    background-color: white;
    border: none;
    cursor: pointer;
    display: inline;
`

const StateCreator = (props) => {

    let now = new Date();

    let initialLightIndex = props.didLoad ? props.lights[0]?.bridgeIndex : 1;
    
    let [color, setColor] = useState({
        hue: currentEditorState.UIhue,
        sat: currentEditorState.UIsat,
        bri: currentEditorState.UIbri
    })

    let [duration, setDuration] = useState(1);

    let [hueValidationError, setHueValidationError] = useState('');

    let [satValidationError, setSatValidationError] = useState('');

    let [briValidationError, setBriValidationError] = useState('');

    let [creatorVisibility, setCreatorVisibility] = useState(false);

    let [previewLight, setPreviewLight] = useState(initialLightIndex);

    const testState = (e) => {

        e.preventDefault();

        // const state = {
        //     hue: Math.round(color.hue * 182.04166),
        //     bri: Math.round(color.brightness/100 * 254),
        //     sat: Math.round(color.saturation/100 * 254),
        //     transitiontime: 1,
        //     on: true
        // }

        let state = new State(color.hue, color.sat, color.bri);

        // console.log(color);

        bridge.send(previewLight, state.data());

    }

    const toggleCreator = () => {
        setCreatorVisibility(!creatorVisibility);
    }

    const handleChange = (e) => {

        setHueValidationError('');
        setSatValidationError('');
        setBriValidationError('');

        if(e.target.name === "hue" && (e.target.value < 0 || e.target.value > 360)) {
            setHueValidationError('Input value must be between 0 and 360');
            return;
        } else if (e.target.name === "sat" && (e.target.value < 0 || e.target.value > 100)) {
            setSatValidationError('Input value must be between 0 and 100');
            return;
        } else if (e.target.name === "bri" && (e.target.value < 1 || e.target.value > 100)) {
            setBriValidationError('Input value must be between 1 and 100');
            return;
        }

        currentEditorState.set(`UI${e.target.name}`, Number(e.target.value));

        // console.log(currentEditorState);

        setColor({
            ...color,
            [e.target.name]:  Number(e.target.value)    
        })

    }

    const AvailableLights = () => {

        return set.map(light => {
            return <option key={light.id} value={light.name}>{light.name}</option>
        })
    
    }

    const selectLight = (e) => {

        let selectedLight = set.find(light => light.name === e.target.value)
        setPreviewLight(selectedLight.bridgeIndex);

    }

    const handleDurationChange = (e) => {
        setDuration(Number(e.target.value));
        currentEditorState.duration = Number(e.target.value);
    } 

    let viewerStyle = {
        backgroundColor: `hsl(${color.hue},${color.sat}%,${(color.bri - color.sat*color.bri/200)}%)`,
        borderRadius: '5px',
        margin: '0px',
        display: 'inline-block'
    }

    return (
        creatorVisibility ? 
        <div className="creator">
            <div id="close-creator" onClick={toggleCreator}>X</div>
            <Droppable droppableId="viewer" type="STATE" isDropDisabled={true}>
                {(provided,snapshot) => (
                    <ViewerContainer ref={provided.innerRef} {...provided.droppableProps} duration={duration * 100}>
                        <Draggable draggableId={`draggable-state-${now.getTime()}`} index={1} >
                        {(provided,snap)=>(
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div style={{...viewerStyle,
                                    height: snap.isDragging ? '100px' : '50px',
                                    width: snap.isDragging ? `${duration * 100}px` : '50px'
                                }}></div>
                            </div>
                        )}
                        </Draggable>
                        {provided.placeholder}
                    </ViewerContainer>
                )}
            </Droppable>
            <div className="lightPreview">
                <form onSubmit={testState}>
                    <select name="select-light" id="select-light" onChange={selectLight}>
                        <AvailableLights/>
                    </select>
                    <button>Preview</button>
                </form>
            </div>
            <div className="hue edit">
                hue
                <input className="hue-slider" name="hue" type="range" min="0" max="360" value={color.hue} step="1" onChange={handleChange}></input>
                <input className="hue-number-input" name="hue" type="number" min="0" max="360" step="1" value={color.hue} onChange={handleChange}></input>
                <div className="validation-error">{hueValidationError}</div>
            </div>
            <div className="saturation edit">
                saturation
                <input className="saturation-slider" name="sat" type="range" min="1" max="100" value={color.sat} step="1" onChange={handleChange}></input>
                <input className="sat-number-input" name="sat" type="number" min="0" max="100" step="1" value={color.sat} onChange={handleChange}></input>
                <div className="validation-error">{satValidationError}</div>
            </div>
            <div className="brightness edit">
                brightness
                <input className="brightness-slider" name="bri" type="range" min="1" max="100" value={color.bri} step="1" onChange={handleChange}></input>
                <input className="sat-number-input" name="bri" type="number" min="1" max="100" step="1" value={color.bri} onChange={handleChange}></input>
                <div className="validation-error">{briValidationError}</div>
            </div>
            <div className="duration edit">
                duration
                <input className="duraton-input" name="duration-measure" type="number" min="1" placeholder="1" onChange={handleDurationChange}></input>
            </div>

        </div>
        :
        <div>
            <NewState id="open-creator" onClick={toggleCreator}>New State</NewState>
        </div>
    )
};

export default StateCreator;