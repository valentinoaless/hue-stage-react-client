import React from 'react';
import Nav from '../Nav/Nav';
import styled from 'styled-components';


const Header = styled.h1`
    padding: 100px;
    text-align: center;
`

const Community = () => {
    return (
        <div>
            <Nav/>
            <Header>community</Header>
        </div>
    );
};

export default Community;