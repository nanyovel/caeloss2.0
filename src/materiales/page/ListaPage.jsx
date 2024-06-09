import React from 'react'
import {  useLocation, useParams } from 'react-router-dom'
import { PlafonComercial } from './PlafonComercial'
import { PlafonMachihembrado } from './PlafonMachihembrado'
import { TechoLisoSheetRock } from './TechoLisoSheetRock'
import { TechoLisoDensGlass } from './TechoLisoDensGlassd'
import { Macrolux } from './Macrolux'
import { DivisionYeso } from './DivisionYeso.jsx'
import { DivisionDensGlass } from './DivisionDensGlass'
import { Header } from '../../components/Header'
import { Navegacion } from '../components/Navegacion'


export const ListaPage = () => {
    const lugar= useLocation()
    const parametro= useParams()
    let id = parametro.id
    let material = ''
    let subTituloHeader=''
   

    let aparte=true

    switch (id) {
        case 'plafoncomercial':
            material = <PlafonComercial/>
            subTituloHeader='Plafon Comercial'
            break;
        case 'plafonmachihembrado':
            material = <PlafonMachihembrado/>
            subTituloHeader='Plafon Machihembrado'
            // lugar.pathname!='/materiales/macrolux/'?
            aparte=false
            break;
        case 'techolisosheetrock':
            material = <TechoLisoSheetRock/>
            subTituloHeader='Techo liso Sheetrock'
            break;
        case 'techolisodensglass':
            material = <TechoLisoDensGlass/>
            subTituloHeader='Techo liso Densglass'
            break;
        case 'macrolux':
            material = <Macrolux/>
            subTituloHeader='Macrolux'
            aparte=false
            break;
        case 'poliacryl':
            material = <Poliacryl/>
            subTituloHeader='Poliacryl'
            aparte=false
            break;
        case 'divisionyeso':
            material = <DivisionYeso/>
            subTituloHeader='Division yeso'
            break;
        case 'divisiondensglass':
            material = <DivisionDensGlass/>
            subTituloHeader='Division Densglass'
            break;
        case 'pisoslaminados':
            material = <PisoLaminado/>
            subTituloHeader='Piso laminado'
            aparte=false
            break;
        case 'pisosvinyl':
            material = <PisoLaminado/>
            subTituloHeader='Piso laminado'
            aparte=false
            break;
        case 'decking':
            material = <PisoLaminado/>
            subTituloHeader='Piso laminado'
            aparte=false
            break;
     
      
        default:
            break;
    }
    return(
            <>

                    <Header titulo='Calculadora de materiales' subTitulo={subTituloHeader} />
                    <Navegacion/>
                    {material}
                 
            </>
    
        )

}


// const Footer=styled.div`
//     position: absolute;
//     bottom: 1px;
//     width: 100%;
//     border: 2px solid green;
// `