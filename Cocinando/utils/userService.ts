import { UpdateProfileApiResponse, UpdateProfileRequest, UpdateProfileResponse } from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';
import { UserManager } from './userManager';


export const UserService = {
   // Actualizar perfil del usuario
   updateProfile: async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible para actualizar perfil');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog('Actualizando perfil del usuario', profileData);
          
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.UPDATE_PROFILE}`, {
               method: 'PATCH',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(profileData),
           });


           const data: UpdateProfileApiResponse = await response.json();
          
           devLog('Respuesta de API actualizar perfil:', data);


           console.log('DEBUG - Response status:', response.status);
           console.log('DEBUG - Response data:', data);


           if (response.ok && data.status === 'success' && data.data?.user) {
               const updatedUser = data.data.user;
              
               console.log('DEBUG - Usuario crudo de API:', updatedUser);
              
               // Mapear campos de la respuesta de la API
               // La API puede devolver campos con nombres diferentes
               const apiUser = updatedUser as any;
              
               // Mapear apellido
               if (profileData.apellido && !updatedUser.apellido) {
                   updatedUser.apellido = profileData.apellido;
               }
              
               // Mapear fecha de nacimiento
               if (profileData.fechaNacimiento && !updatedUser.fechaNacimiento) {
                   updatedUser.fechaNacimiento = profileData.fechaNacimiento;
               }
              
               // Mapear nacionalidad (manejar ambos campos)
               if (profileData.nacionalidad) {
                   updatedUser.nacionalidad = profileData.nacionalidad;
                   updatedUser.nationality = profileData.nacionalidad; // Campo normalizado para UI
               }
              
               // Agregar campos adicionales para UI si no están presentes
               if (!updatedUser.age) updatedUser.age = 25;
               if (!updatedUser.nationality && !updatedUser.nacionalidad) {
                   updatedUser.nationality = 'Argentina';
               }
               if (!updatedUser.recipesCount) updatedUser.recipesCount = 0;
              
               console.log('DEBUG - Usuario actualizado procesado:', updatedUser);
               devLog('Perfil actualizado exitosamente', { user: updatedUser.name });
              
               return {
                   success: true,
                   user: updatedUser
               };
           } else {
               console.log('DEBUG - Error en respuesta:', {
                   status: response.status,
                   dataStatus: data.status,
                   hasUser: !!data.data?.user
               });
               devLog('Error en la respuesta de la API de actualizar perfil');
               return {
                   success: false,
                   error: data.message || 'Error al actualizar el perfil'
               };
           }
       } catch (error) {
           console.error('Error al actualizar perfil:', error);
           devLog('Error de conexión al actualizar perfil', error);
          
           return {
               success: false,
               error: 'Error de conexión al actualizar el perfil'
           };
       }
   }
};