import React, { useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../UserContext';
import userIcon from '../resources/account_circle-24px.svg';

const Nav = (props) => {

    let history = useHistory();

    let {user, setUser} = useContext(UserContext);

    let [dropDownActive, setDropDownActive] = useState(false);

    useEffect(()=>{
        document.addEventListener("mousedown", handleClick);
        return () => {document.removeEventListener("mousedown", handleClick)};
    },[]);

    const toggleDropdown = () => {
        setDropDownActive(!dropDownActive);
    } 

    const handleClick = (e) => {
        console.log(e.target.id)
        if(e.target.name !== "dropdown" && e.target.id !== "dropdown") {
            setDropDownActive(false);
        } 
    } 

    const logOut = () => {
        console.log('log out')
        localStorage.clear();
        let resetUser = {
            username: '',
            token: '',
            loggedIn: false
        }
        history.push('/');
        setUser({...resetUser});
    }

    

    return (
        <Navbar home={props.home}>
            <Link to="/about">about</Link>
            <Link to="/tutorials">tutorials</Link>
            <Link to="/community">community</Link>
            {/* <Link to="/auth/login"><Login>log out</Login></Link> */}
            {user.loggedIn ? 
                <Account onClick={toggleDropdown} active={dropDownActive}>
                    <div><svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 0 24 24" width="35"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/></svg></div>
                    <AccountDropdown name="dropdown" active={dropDownActive}>
                        <Link name="dropdown" to="/account/user">account</Link>
                        <Link name="dropdown" to="/dashboard">dashboard</Link>
                        <div id="dropdown" onClick={logOut}>log out</div>
                    </AccountDropdown>
                </Account>
                :
                <AuthLinks>
                    <Link to="/auth/login"><Login>log in</Login></Link>
                    <Link to="/auth/signup"><Signup>sign up</Signup></Link>
                </AuthLinks>
            }
        </Navbar>
    );
};

export default Nav;


let navbarAnimation = keyframes`
    0% {top: -80px;}
    50% {top: -80px;}
    100% {top: 0px;}
`

let Navbar = styled.div`
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    font-weight: 500;
    animation-name: ${props => props.home? navbarAnimation : ''};
    animation-duration: 3s;
    animation-iteration-count: 1;
    & > * {
        margin: 10px 5px;
        padding: 10px;
        color: white;
        text-decoration: none;
        &:hover {
            color: #bbb;
        }
    }
`
let Login = styled.div`
    background-color: white;
    border-radius: 10px;
    color: #6e6e6e;
    padding: 10px;
    margin-right: 5px;
    &:hover {
        background-color: #ddd;
    }
`

let Signup = styled.div`
    border-radius: 10px;
    background-color: deeppink;
    color: white;
    padding: 10px;
    &:hover {
        background-color: darkmagenta;
    }
`

let AuthLinks = styled.div`
    display: flex;
    & > * {
        text-decoration: none;
    }
`

let Account = styled.div`
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > * {
        fill: white;
        cursor: pointer;
        &:hover {
            fill: rgba(3,252,194,1);
        }
    }
    &:hover {
        background-color: rgba(255,255,255,0.4);
        border-radius: 50%;
    }
`

let AccountDropdown = styled.div`
    margin-top: 5px;
    font-weight: 300;
    font-size: 0.9rem;
    position: fixed;
    display: ${(props) => props.active ? 'flex' : 'none'};
    border-radius: 10px;
    flex-direction: column;
    top: 60px;
    right: 10px;
    background-color: rgba(80,80,80,1);
    & > * {
        color: white;
        text-decoration: none;
        padding: 10px 30px 10px 10px;
        margin: 5px 0;
        &:hover {
            color: white;
            background-color: rgba(3,252,194,0.3);
        }
    }
`