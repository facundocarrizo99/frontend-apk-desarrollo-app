import { LoginApiResponse, LoginResponse, User } from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';


// Usuarios de prueba con la nueva estructura
export const testUsers: User[] = [
   {
       _id: '1',
       id: '1',
       name: 'Admin Usuario',
       email: 'admin@cocinando.org',
       avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
       role: 'admin',
       createdAt: '2024-01-01T00:00:00.000Z',
       updatedAt: '2024-01-01T00:00:00.000Z',
       __v: 0,
       // Campos adicionales para edición de perfil
       apellido: 'González',
       fechaNacimiento: '1988-03-15',
       nacionalidad: 'Argentina',
       // Campos adicionales para UI
       age: 35,
       nationality: 'Argentina',
       recipesCount: 25
   },
   {
       _id: '2',
       id: '2',
       name: 'Pedro Pérez',
       email: 'pedro.perez@email.com',
       avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
       role: 'alumno',
       createdAt: '2024-01-01T00:00:00.000Z',
       updatedAt: '2024-01-01T00:00:00.000Z',
       __v: 0,
       // Campos adicionales para edición de perfil
       apellido: 'Martínez',
       fechaNacimiento: '1995-07-22',
       nacionalidad: 'Argentina',
       // Campos adicionales para UI
       age: 28,
       nationality: 'Argentina',
       recipesCount: 12
   }
];


// Usuario actual, token y refreshToken
let currentUser: User | null = null;
let authToken: string | null = null;
let refreshToken: string | null = null;


export const UserManager = {
   // Login con API real
   login: async (email: string, password: string): Promise<LoginResponse> => {
       try {
           devLog('Enviando petición de login a API', { email });
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.LOGIN}`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({ email, password }),
           });


           const data: LoginApiResponse = await response.json();
          
           devLog('Respuesta de API login:', data);


           if (response.ok && data.status === 'success' && data.data?.user && data.token) {
               // Login exitoso - procesar respuesta de API
               const user = data.data.user;
              
               // Agregar campos adicionales para UI si no están presentes
               if (!user.age) user.age = 25; // Valor por defecto
               if (!user.nationality) user.nationality = 'Argentina'; // Valor por defecto
               if (!user.recipesCount) user.recipesCount = 0; // Valor por defecto
              
               currentUser = user;
               authToken = data.token;
               refreshToken = data.refreshToken;
              
               // TODO: Guardar tokens en AsyncStorage para persistencia
              
               devLog('Login exitoso', { user: user.name, role: user.role });
              
               return {
                   success: true,
                   user: user,
                   token: data.token,
                   refreshToken: data.refreshToken
               };
           } else {
               // Login fallido
               const errorMessage = data.status === 'error' ? 'Credenciales incorrectas' : 'Error al iniciar sesión';
               devLog('Login fallido', { status: data.status });
              
               return {
                   success: false,
                   error: errorMessage
               };
           }
       } catch (error) {
           console.error('Error en login:', error);
           devLog('Error de conexión en login', error);
          
           return {
               success: false,
               error: 'Error de conexión. Verifica tu internet.'
           };
       }
   },


   // Login local para testing/desarrollo
   loginLocal: (email: string, password: string): LoginResponse => {
       devLog('Usando login local para desarrollo', { email });
      
       // Simulación simple de login para desarrollo
       const user = testUsers.find(u => u.email === email);
       if (user && password === '123456') { // Password simple para desarrollo
           currentUser = user;
           authToken = 'dev-token-' + Date.now();
           refreshToken = 'dev-refresh-token-' + Date.now();
          
           devLog('Login local exitoso', { user: user.name, role: user.role });
          
           return {
               success: true,
               user: user,
               token: authToken,
               refreshToken: refreshToken
           };
       }
      
       devLog('Login local fallido');
       return {
           success: false,
           error: 'Credenciales incorrectas'
       };
   },


   // Obtener usuario actual
   getCurrentUser: (): User | null => {
       return currentUser;
   },


   // Actualizar usuario actual en memoria
   updateCurrentUser: (updatedUser: User): void => {
       console.log('DEBUG - Actualizando usuario en memoria:', {
           antes: currentUser ? currentUser.name : 'null',
           despues: updatedUser.name
       });
      
       currentUser = updatedUser;
       devLog('Usuario actualizado en memoria', { user: updatedUser.name });
      
       console.log('DEBUG - Usuario actualizado en currentUser:', currentUser);
   },


   // Verificar si está autenticado
   isAuthenticated: (): boolean => {
       return currentUser !== null && authToken !== null;
   },


   // Verificar si es admin
   isAdmin: (): boolean => {
       return currentUser?.role === 'admin';
   },


   // Verificar si es alumno
   isAlumno: (): boolean => {
       return currentUser?.role === 'alumno';
   },


   // Obtener token de autenticación
   getAuthToken: (): string | null => {
       return authToken;
   },


   // Obtener refresh token
   getRefreshToken: (): string | null => {
       return refreshToken;
   },


   // Cerrar sesión
   logout: (): void => {
       devLog('Cerrando sesión', { user: currentUser?.name });
       currentUser = null;
       authToken = null;
       refreshToken = null;
       // TODO: Limpiar AsyncStorage
   },


   // Obtener todos los usuarios de prueba
   getTestUsers: (): User[] => {
       return testUsers;
   },


   // Simular login rápido para testing
   quickLoginAsAdmin: (): User => {
       currentUser = testUsers[0]; // Admin
       authToken = 'quick-admin-token-' + Date.now();
       devLog('Quick login as admin', { user: currentUser.name });
       return currentUser;
   },


   quickLoginAsAlumno: (): User => {
       currentUser = testUsers[1]; // Alumno
       authToken = 'quick-alumno-token-' + Date.now();
       devLog('Quick login as alumno', { user: currentUser.name });
       return currentUser;
   }
};