export interface User {
   id: string;
   name: string;
   email: string;
   avatar: string;
   age: number;
   nationality: string;
   recipesCount: number;
   role: 'admin' | 'alumno';
}


// Usuarios de prueba
export const testUsers: User[] = [
   {
       id: '1',
       name: 'Admin Usuario',
       email: 'admin@cocinando.org',
       avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
       age: 35,
       nationality: 'Argentina',
       recipesCount: 25,
       role: 'admin'
   },
   {
       id: '2',
       name: 'Pedro Pérez',
       email: 'pedro.perez@email.com',
       avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
       age: 28,
       nationality: 'Argentino',
       recipesCount: 12,
       role: 'alumno'
   }
];


// Usuario actual (simulación, en producción vendría de auth/storage)
let currentUser: User | null = null;


export const UserManager = {
   // Simular login
   login: (email: string, password: string): User | null => {
       // Simulación simple de login
       const user = testUsers.find(u => u.email === email);
       if (user) {
           currentUser = user;
           return user;
       }
       return null;
   },


   // Obtener usuario actual
   getCurrentUser: (): User | null => {
       return currentUser;
   },


   // Verificar si es admin
   isAdmin: (): boolean => {
       return currentUser?.role === 'admin';
   },


   // Verificar si es alumno
   isAlumno: (): boolean => {
       return currentUser?.role === 'alumno';
   },


   // Cerrar sesión
   logout: (): void => {
       currentUser = null;
   },


   // Obtener todos los usuarios de prueba
   getTestUsers: (): User[] => {
       return testUsers;
   },


   // Simular login rápido para testing
   quickLoginAsAdmin: (): User => {
       currentUser = testUsers[0]; // Admin
       return currentUser;
   },


   quickLoginAsAlumno: (): User => {
       currentUser = testUsers[1]; // Alumno
       return currentUser;
   }
};

