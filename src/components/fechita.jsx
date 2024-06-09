export const fechita = (fecha) => {
    const dias=['Dom','Lun','Mar','Mier','Jue','Vie','Sab',]
    const meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sept','Oct','Nov','Dic']
    let dia = dias[fecha.getDay()]
    let mes = meses[fecha.getMonth()]
    return (dia +' '+ fecha.getDate() +' '+mes+' '+fecha.getFullYear())

}
//