import React from 'react';
import Nav from '../Nav/Nav';
import styled from 'styled-components';


const Header = styled.h1`
    padding: 100px;
    text-align: center;
`

const About = () => {
    return (
        <div>
            <Nav/>
            <Header>about</Header>
        </div>
    );
};

export default About;