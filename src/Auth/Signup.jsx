import React, { useState, useContext } from 'react';
import Nav from '../Nav/Nav';
import styled from 'styled-components';
import GoogleLogo from '../resources/google-icon.svg';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';



const SignUp = () => {

    let history = useHistory();

    let {user, setUser} = useContext(UserContext);

    if(user.loggedIn) history.push('/dashboard');

    let [credentials, setCredentials] = useState({
        email: '',
        username: '',
        password: ''
    })

    let [validation, setValidation] = useState({
        emailError: '',
        usernameError: '',
        passwordError: ''
    })

    let [loading, setLoading] = useState(false);

    const handleChange = (e) => {


        setValidation({
            emailError: '',
            usernameError: '',
            passwordError: ''
        });

        if(e.target.name === 'confirm password') {
            setValidation({
                ...validation,
                passwordError: e.target.value === credentials.password ? '' : 'passwords do not match'
            })
        }

        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('http://localhost:5000/api/user/register', credentials)
            .then(res => {
                console.log(res.data);
                if(res.data === 'username is taken') {
                    setValidation({
                        ...validation,
                        usernameError: 'this username is already taken'
                    })
                    setLoading(false)
                    return null;
                } else if (res.data === 'email is taken') {
                    setValidation({
                        ...validation,
                        emailError: 'user with provided email already exists'
                    })
                    setLoading(false)
                    return null;
                }

                setLoading(false);
            }).catch(err => {
                console.log(err);
            })

        history.push('/auth/login');

    }

    return (
        <div>
        <Nav/>
        <Container>
           <Form onSubmit={submit}>
                <Label>sign up</Label>
                <Input type="email" placeholder="email" name="email" onChange={handleChange}></Input>
                {validation.emailError && <ErrorMessage>{validation.emailError}</ErrorMessage>}
                <Input type="text" placeholder="username" name="username" onChange={handleChange}></Input>
                {validation.usernameError && <ErrorMessage>{validation.usernameError}</ErrorMessage>}
                <Input type="password" placeholder="password" name="password" onChange={handleChange}></Input>
                <Input type="password" placeholder="confirm password" name="confirm password" onChange={handleChange}></Input>
                {validation.passwordError && <ErrorMessage>{validation.passwordError}</ErrorMessage>}
                <SignUpButton>sign up</SignUpButton>
                <Other>- or sign up with -</Other>
                <Google name="google">
                    <img name="google" src={GoogleLogo} alt="Google"></img>
                </Google>
                <LogIn>already have an account? <AuthLink><Link to="/auth/login">log in</Link></AuthLink></LogIn>
                
           </Form>
        </Container>
        </div>
    );
};

export default SignUp;

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

let SignUpButton = styled.button`
    color: white;
    margin-top: 20px;
    padding: 10px;
    font-size: 1rem;
    width: 8vw;
    min-width: 100px;
    background-color: deeppink;
    transition: all 200ms;
    border: none;
    border-radius: 3px;
    &:focus, &:hover {
        color: white;
        outline: none;
        background-color: darkmagenta;
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

let LogIn = styled.div`
    margin-top: 20px;
    font-weight: 300;
`

let AuthLink = styled.div`
    display: inline;
    width: 16vw;
    min-width: 200px;
    font-size: 1rem;
    & > * {
        color: rgba(3,252,194,1);
        font-weight: 400;
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