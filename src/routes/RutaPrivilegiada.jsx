import {  Navigate, useNavigate } from 'react-router-dom'


export const RutaPrivilegiada = ({
    children,
    userMaster, 
    privilegioReq
   
}) => {
	const navegacion=useNavigate()

	if(userMaster){
			// Saber si existe el objeto que dentro dice la propiedad
			const objetoPrivilegio=userMaster.privilegios.find(privilegio=>privilegio.code==privilegioReq)

			// Si existe el objeto, que verifique si tiene el estado true, es decir si el usuario esta autorizado
			if(objetoPrivilegio){
				if(objetoPrivilegio.valor==true){
					console.log('✅✅✅YUCAA✅✅✅✅')
					return children
				}
				else{
					// navegacion('/')
					return <Navigate replace to='/' />
				}
			}
			// Si el objeto no existe entonces que lo reenvie hacia el HOME
			else{
				// navegacion('/')
				return <Navigate replace to='/' />
			}
			
            
        }
	}

