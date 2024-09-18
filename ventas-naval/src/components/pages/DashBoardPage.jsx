import React from 'react'
import Products from '../../Products/Product'
import Sidebar from '../../Sidebar/Sidebar'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;  
  gap: 30px;
`;


export const DashboardPage = (  { userRole } ) => {
  const handleChange = (event) => {
    console.log(event.target.value);
  };
  
  return (
    <>
      <Container>
        <Sidebar handleChange={handleChange} />
        <Products  userRole={userRole} />
      </Container>
    </>
    
  )
}
