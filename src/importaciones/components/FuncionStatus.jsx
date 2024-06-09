export default function statusImportaciones(valor){
    let statusReturn
    valor==1?
    statusReturn='Transito Maritimo'
    :
    valor==2?
    statusReturn='En puerto'
    :
    valor==3?
    statusReturn='Recep. Almacen'
    :
    valor==4?
    statusReturn='Dpto. Import'
    :
    valor==5?
    statusReturn='Listo Sap✅'
    :
    ''

    return statusReturn
}