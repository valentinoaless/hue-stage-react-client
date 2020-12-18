import React, {useContext} from 'react';
import styled, { keyframes } from 'styled-components';
import Nav from '../Nav/Nav';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Home = () => {

    let {user, setUser} = useContext(UserContext)

    let history = useHistory();

    return (
        <Page>
            <Nav home={true}/>
            <Landing>
                <Logo className="logo">HUE STAGE</Logo>
                <Hook>a sleek, web-based Philips™ Hue lights controller</Hook>
                <GetStarted onClick={()=>{ user.loggedIn ? history.push('/dashboard') : history.push('auth/signup') }}>get started</GetStarted>
            </Landing>
            <Animations>
                <Orb1/>
                <Orb2/>
                <Orb3/>
                <Orb4/>
                <Orb5/>
                <Orb6/>
            </Animations>
        </Page>
    );
};

export default Home;

let Landing = styled.div`
    color: white;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: rgba(0,0,0,0);
`

let Page = styled.div`
    background-color: rgba(0,0,0,0);
`

let logoAnimation = keyframes`
    0% {
        padding-top: 450px;
        opacity: 0%;
    }
    30% {
        opacity: 30%;
    }
    70% {
        padding-top: 450px;
    }
    100% {
        padding-top: 350px;
    }
`

let hookAnimation = keyframes`
    0% {
        transform: translateY(50px);
        opacity: 0%;
    }
    90% {
        transform: translateY(50px);
        opacity: 0%;
    }
    100% {
        transform: translateY(0px);
        opacity: 100%;
    }
`

let Hook = styled.p`
    animation-name: ${hookAnimation};
    animation-duration: 3s;
    animation-iteration-count: 1;
    position: absolute;
    top: 450px;
`

let GetStarted = styled.div`
    top: 500px;
    position: absolute;
    background-color: cyan;
    font-weight: 700;
    color: #444;
    padding: 10px 20px;
    border-radius: 20px;
    animation-name: ${hookAnimation};
    animation-delay: 100ms;
    animation-duration: 3s;
    animation-iteration-count: 1;
    z-index: 3;
    cursor: pointer;
    &:hover {
        color: white;
        background-color: rgba(0,255,255,0.3);
    }
    
`

let Logo = styled.h2`
    padding-top: 350px;
    font-size: 4rem;
    letter-spacing: 0.8rem;
    z-index: 2;
    background-color: rgba(0,0,0,0);
    animation-name: ${logoAnimation};
    animation-duration: 3s;
    animation-iteration-count: 1;
`

let Animations = styled.div`
    position: fixed;
    top: 50vh;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    & > * {
        z-index: -1;
    }
    
`

let orb1Animation = keyframes`
    0% {
        width: 0px;
        height: 0px;
        left: 800px;
        box-shadow: none;
    }

    50% {
        width: 0.5px;
        height: 0.5px;
        box-shadow: 0 0 1500px 400px deeppink;
    }
   
    100% {
        left: 0px;
        box-shadow: none;
    
    }
`

let orb2Animation = keyframes`
    0% {
        width: 0px;
        height: 0px;
        right: 800px;
        box-shadow: none;
    }

    50% {
        width: 0.5px;
        height: 0.5px;
        box-shadow: 0 0 1500px 400px cyan;
    }
   
    100% {
        right: 0px;
        box-shadow: none;
    }
`

let Orb1 = styled.div`
    position: absolute;
    border-radius: 50%;
    overflow: hidden;
    animation-name: ${orb1Animation};
    animation-duration: 3s;
    animation-iteration-count: 1;
`

let Orb2 = styled.div`
    position: absolute;
    border-radius: 50%;
    right: 0px;
    overflow: hidden;
    animation-name: ${orb2Animation};
    animation-duration: 3s;
    animation-iteration-count: 1;
`

let orb3Anim = keyframes`
    0% {
        width: 0px;
        height: 0px;
        box-shadow: none;
    }

    50% {
        width: 0.5px;
        height: 0.5px;
        box-shadow: 0 0 2000px 300px rgba(0,255,255,0.3);
    }
   
    100% {
        box-shadow: none;
    }
`

let Orb3 = styled.div`
    position: absolute;
    border-radius: 50%;
    right: 500px;
    overflow: hidden;
    animation-name: ${orb3Anim};
    animation-duration: 3s;
    animation-delay: 4s;
    animation-iteration-count: infinite;
`

let orb4Anim = keyframes`
    0% {
        width: 0px;
        height: 0px;
        box-shadow: none;
    }
    50% {
        width: 0.5px;
        height: 0.5px;
        box-shadow: 0 0 2000px 300px rgba(255,0,255,0.3);
    }
   
    100% {
        box-shadow: none;
    }
`

let Orb4 = styled.div`
    position: absolute;
    border-radius: 50%;
    left: 500px;
    overflow: hidden;
    animation-name: ${orb4Anim};
    animation-duration: 3s;
    animation-delay: 3s;
    animation-iteration-count: infinite;
`

let orb5Anim = keyframes`
    0% {
        width: 0px;
        height: 0px;
        box-shadow: none;
    }
    50% {
        width: 0.5px;
        height: 0.5px;
        box-shadow: 0 0 2000px 300px rgba(255,255,0,0.3);
    }
   
    100% {
        box-shadow: none;
    }
`

let Orb5 = styled.div`
    position: absolute;
    border-radius: 50%;
    left: 900px;
    overflow: hidden;
    animation-name: ${orb5Anim};
    animation-duration: 3s;
    animation-delay: 3500ms;
    animation-iteration-count: infinite;
`

let orb6Anim = keyframes`
    0% {
        width: 0px;
        height: 0px;
        box-shadow: none;
    }
    50% {
        width: 0.5px;
        height: 0.5px;
        box-shadow: 0 0 2000px 300px rgba(255,0,0,0.3);
    }
   
    100% {
        box-shadow: none;
    }
`

let Orb6 = styled.div`
    position: absolute;
    border-radius: 50%;
    right: 900px;
    overflow: hidden;
    animation-name: ${orb6Anim};
    animation-duration: 3s;
    animation-delay: 5s;
    animation-iteration-count: infinite;
`





// animation-name: ${props => props.home? navbarAnimation : ''};
//     animation-duration: 2s;
//     animation-iteration-count: 1;
