import React, { useState } from 'react'
import { collection, doc, onSnapshot, setDoc, writeBatch } from 'firebase/firestore'
import db from './src/firebase/firebaseConfig'

export default function funcionConsumible(
    tipo
    ){
        let valor=''
        if(tipo=='transporte'){
            // const fechaInicial = new Date(2024,2,20);
            const fechaInicial = new Date(2024,3,17);
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaActual - fechaInicial;
    
            // Calcula la diferencia en días redondeando hacia abajo
            const diasTranscurridos = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
            
            // valor =67-diasTranscurridos/2
            valor=40
        }
        else if(tipo=='mantenimiento'){
            valor =100
        }
    return {
        valorPorcentaja:valor+'%',
        valorNumber:valor
    }
}