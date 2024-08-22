import { styled } from "styled-components";
import theme from '../config/theme.jsx';

export const BtnGeneralButton = styled.button`
    margin: 10px;
    cursor: pointer; 
    
    border-radius: 5px;
    width: 100px;
    padding: 5px;
    border: none;
    outline: none;
    font-size: 1rem;
    background-color: ${theme.azul3} ;
    color: white;
    box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
    display: inline-block;
    

    &:focus{
      background-color: ${theme.azul3} ;
      color: #fff;
    }

    &:hover{
      background-color: #fff ;
    color: #0074d9;
    }
    &:active{
      background-color:  #135c9d;
      color: #fff;
    }

  &.danger{
      background-color: red;
      color: white;
  &:hover{
    color: red;
    background-color: white;
    }
}
`;