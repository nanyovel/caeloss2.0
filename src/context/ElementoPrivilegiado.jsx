export const ElementoPrivilegiado = ({
  children,
  userMaster,
  privilegioReq

}) => {

  if(userMaster){
    // Saber si existe el objeto que dentro dice la propiedad
    // console.log(userMaster)
    const objetoPrivilegio=userMaster.privilegios.find(privilegio=>privilegio.code==privilegioReq);

    // Si existe el objeto, que verifique si tiene el estado true, es decir si el usuario esta autorizado
    if(objetoPrivilegio){
      if(objetoPrivilegio.valor==true){
        console.log('✅✅✅YUCAA✅✅✅✅');
        return children;
      }
    }

  }
};

