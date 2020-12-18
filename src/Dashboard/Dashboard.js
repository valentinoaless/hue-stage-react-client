import React, { useContext, useState, useEffect } from 'react';
import styled, {keyframes} from 'styled-components';
import Nav from '../Nav/Nav';
import { UserContext } from '../UserContext';
import { SetContext } from '../SetContext';
import { useHistory, Link } from 'react-router-dom';
import AddIcon from '../resources/add-black-18dp.svg';
import CloseIcon from '../resources/clear-black-18dp.svg';
import EditIcon from '../resources/create-black-18dp.svg';
import axios from 'axios';



const Dashboard = () => {

    let {user, setUser} = useContext(UserContext);

    let {globalSetData, setGlobalSetData} = useContext(SetContext);

    let [loading, setLoading] = useState(false);

    let [showDialog, setShowDialog] = useState(false);

    let [newSetName, setNewSetName] = useState({name: 'new set'});

    let [timingMethod, setTimingMethod] = useState('time');

    let history = useHistory();

    if(!user.loggedIn) history.push('/auth/login');

    let loadUser = async () => {

        await axios.get('http://localhost:5000/api/user/profile', {
            headers: {auth_token: localStorage.getItem("user_auth_token")}
        }).then(res => {
            setUser({
                ...user, 
                username: res.data.username
            })
        })

    }

    useEffect(() => {
        loadUser();
    },[]);

    let handleChange = (e) => {

        setNewSetName({name: e.target.value});  
    }

    let changeTimeMethod = (e) => {

        setTimingMethod(e.target.id);

    }

    let generateSet = async () => {

        let set = {};

        let loading = true;

        await axios.post('http://localhost:5000/api/user/set/newset', 
        {
            setName: newSetName.name,
            timeMethod: timingMethod,
        }, 
        {
            headers: {auth_token: localStorage.getItem("user_auth_token")}
        }).then(res => {
           
            set.creator = res.data.creator;
            set.name = res.data.name;
            set.timeMethod = res.data.timeMethod;
            set.url = res.data.url;
            set._id = res.data._id;
            set.states = res.data.states;

        }).catch(err => {
            console.log(err);
        })

        if(set) {
            history.push(`/set/${set.url}`);
        } 
        
        loading = false;

        setGlobalSetData(set);

        // history.push('/dashboard/set');
    }

    let SetDialog = () => {
        return (
        <div>
            <CloseModal id="close-modal" src={CloseIcon} alt="close set dialog"></CloseModal>
            <Input>
                <SetName type="text" onBlur={handleChange} defaultValue={newSetName.name} onFocus={(e) => e.target.select()}/>
                <Edit src={EditIcon} alt="edit set name"/>
            </Input>
            <MethodPicker>
                <TimeMethod id="time" onClick={changeTimeMethod} selected={timingMethod === 'time' ? true : false}>time</TimeMethod>
                <TimeMethod id="tempo" onClick={changeTimeMethod} selected={timingMethod === 'tempo' ? true : false}>tempo</TimeMethod>
            </MethodPicker>
            <CreateSet onClick={generateSet}>create</CreateSet>
        </div>)
    }

    let handleClick = (e) => {
        if(e.target.id === "set-dialog-modal-background" || e.target.id === "close-modal" ) setShowDialog(false);
    }

    
    return (
        <div>
            <Nav />
            <Page>
                <Welcome>hi, <Link to="/account/user">{user.username}</Link></Welcome>
                <Header>dashboard</Header>
                <Sets> 
                    <AddSet onClick={() => {setShowDialog(true)}}>
                        <img src={AddIcon} alt="New Set" width="40px"></img>
                        <Label>new set</Label>
                    </AddSet>
                </Sets>
                {showDialog ?
                <Background id="set-dialog-modal-background" onClick={handleClick}>
                    <Modal>
                        <SetDialog />
                    </Modal>
                </Background>
                :
                <></>
                }

            </Page>
        </div>
    );
};

export default Dashboard;

const Page = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`

const Header = styled.h1`
    color: deeppink;
    font-weight: 300;
    letter-spacing: 1px;
    font-weight: 800;
    padding-top: 80px;
    padding-bottom: 40px;
    text-align: center;
`

const Welcome = styled.h1`
    font-weight: 300;
    padding-top: 100px;
    text-align: center;
    & > * {
        text-decoration: none;
        color: white;
        &:hover {
            color: deeppink;
        }
    }
`

let Sets = styled.div`
    width: 80vw;
    height: 60vh;
    background-color: rgba(255,255,255,0.05);
    border-radius: 30px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
`

let Label = styled.h4`
    position: absolute;
    bottom: -30px;
    
`

let AddSet = styled.div`
    position: relative;
    width: 150px;
    height: 100px;
    margin: 30px;
    border: 1px solid white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    &:hover {
        background-color: rgba(255,255,255,0.2);
    }
`

let Background = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: rgba(0,0,0,0.7);
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

let SetName = styled.input`
    color: #fff;
    width: 15vw;
    min-width: 200px;
    font-size: 1rem;
    background-color: #222;
    padding: 10px;
    margin: 10px;
    border-radius: 3px;
    border: none;
    text-align: center;
    transition: all 200ms;
    z-index: 1;
    background-color: rgba(255,255,255,0.1);

    &:focus {
        outline: none;
        border-bottom: 2px solid white;
        background-color: rgba(255,255,255,0.4);
    }

    &::placeholder {
        color: #fff;
    }
`

let MethodPicker = styled.div`
    display: flex;
`

let TimeMethod = styled.div`
    background-color: ${ props => props.selected ? 'rgba(3,252,194,0.5)' : '#333'};
    color:#fff;
    height: 50px;
    width: 100px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${ props => props.selected ? 'rgba(3,252,194,0.5)' : 'rgba(3,252,194,0.2)'};
    }
`

let CloseModal = styled.img`
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
    &:hover {
        background-color: rgba(255,255,255,0.3);
        border-radius: 50%;
    }
`

let CreateSet = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0,255,255,0.7);
    color:#fff;
    height: 50px;
    width: 100px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: rgba(0,255,255,0.2);
    }
`

let Input = styled.div`
    position: relative;
`

let Edit = styled.img`
    position: absolute;
    right: 20px;
    top: 35%;
    width: 20px;
    z-index: 0;
`
