import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../Nav/Nav';
import GoogleLogo from '../resources/google-icon.svg';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';


const Login = () => {

    let history = useHistory();

    let {user, setUser} = useContext(UserContext);
    
    let [validation, setValidation] = useState('');

    let [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })


    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('http://localhost:5000/api/user/login', credentials)
            .then(res => {
                localStorage.setItem("user_auth_token", res.data);
                setUser({
                    ...user,
                    loggedIn: true});
                history.push('/dashboard');
                return null;
            }).catch(err => {
                console.log(err);
                setValidation('invalid username/email and or password');
                return null;
            })

    }

    const oauthLogin = (e) => {
        
    }

    const handleChange = (e) => {

        setValidation('');

        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
        
    }

    console.log('render');


    return (
        <div>
            <Nav/>
            <Container>
            <Form onSubmit={handleSubmit}>
                    <Label>log in</Label>
                    <Input type="text" placeholder="email or username" name="username" onChange={handleChange}></Input>
                    <Input type="password" placeholder="password" name="password" onChange={handleChange}></Input>
                    {validation && <ErrorMessage>{validation}</ErrorMessage>}
                    <AuthLink>
                        <Link to="/auth/reset">forgot password?</Link>
                        <Link to="/auth/signup">sign up</Link>
                    </AuthLink>
                    <LogIn>log in</LogIn>
                    <Other>- or log in with -</Other>
                    <Google name="google" onClick={oauthLogin}>
                        <img name="google" src={GoogleLogo} alt="Google"></img>
                    </Google>
            </Form>
            </Container>
        </div>
    );
};

export default Login;

let Container = styled.div`
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow-y: hidden;
    overflow-x: hidden;
`
let Form = styled.form`
    color: white;
    display: flex;
    min-width: 300px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(255,255,255,0.1);
    padding: 50px;
    border-radius: 10px;
`
let Input = styled.input`
    color: #222;
    border: 1px solid lightgrey;
    width: 15vw;
    min-width: 200px;
    font-size: 1rem;
    background-color: lightgrey;
    border: 3px solid #eee;
    padding: 10px;
    margin: 10px;
    border-radius: 3px;
    transition: all 200ms;
    &:focus {
        outline: none;
        background-color: white;
        border: 3px solid deeppink;
    }

    &::placeholder {
        color: #888;
    }
`

let LogIn = styled.button`
    color: rgb(0, 87, 66);
    margin-top: 20px;
    padding: 10px;
    font-size: 1rem;
    width: 8vw;
    min-width: 100px;
    background-color: rgba(3,252,194,1);
    transition: all 200ms;
    border: none;
    border-radius: 3px;
    &:focus, &:hover {
        color: white;
        outline: none;
        background-color: rgba(0,171,131,1);
    }
`

let Label = styled.h2`
    margin-bottom: 30px;
    font-weight: 300;
    font-size: 2rem;
`

let Other = styled.p`
    margin-top: 20px;
`

let Google = styled.div`
    margin-top: 20px;
    height: 50px;
    width: 50px;
    padding: 10px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0);
    border: none;
    transition: all 200ms;
    &:focus, &:hover {
        outline: none;
        background-color: rgba(255,255,255,0.3);
    }
`

let AuthLink = styled.div`
    display: flex;
    justify-content: space-between;
    width: 16vw;
    min-width: 200px;
    font-size: 0.9rem;
    & > * {
        color: rgba(3,252,194,1);
        font-weight: 300;
        text-decoration: none;
        margin-top: 5px;

        &:hover {
            color: #fff;
        }

    }
`

let ErrorMessage = styled.p`
    color: red;
    font-size: 0.8rem;
    font-weight: 300;
    background-color: rgba(255,255,255,1);
    padding: 5px 20px;
    border-radius: 10px;
`