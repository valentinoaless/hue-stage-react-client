import React from 'react';
import Nav from '../Nav/Nav';
import styled from 'styled-components';


const Header = styled.h1`
    padding: 100px;
    text-align: center;
`

const Tutorials = () => {
    return (
        <div>
            <Nav/>
            <Header>tutorials</Header>
        </div>
    );
};

export default Tutorials;