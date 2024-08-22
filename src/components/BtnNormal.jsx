import styled  from 'styled-components';
import { BtnGeneralButton } from './BtnGeneralButton';

export const BtnNormal = styled(BtnGeneralButton)`
    &.danger{
        background-color: red;
        color: white;
    &:hover{
        background-color: white;
        color:red;
    }
    &:active{
        background-color: #c52a2a;
        color: white;
    }
    }
    &.buscar{
        margin: 0;
    }
`;

export const BtnNormalw = ({tipo,texto}) => {
  return (
    <BtnSingle
      className={tipo}
    >
      {texto}
    </BtnSingle>
  );
};

const BtnSingle=styled(BtnGeneralButton)`
&.normal{

}
&.danger{
    background-color: red;
    color: white;
    &:hover{
        background-color: white;
        color:red;
    }
    &:active{
        background-color: #c52a2a;
    color: white;
    }
}
&.buscar{
    margin: 0;
  }`;