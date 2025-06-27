import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { devLog } from './config';
import { UserManager } from './userManager';


// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = [
   '/',
   '/index',
   '/login',
   '/recuperarPassword',
   '/verificarCodigo',
   '/cambiarPassword'
];


export const useAuthGuard = () => {
   const pathname = usePathname();
   const isAuthenticated = UserManager.isAuthenticated();
   const isPublicRoute = PUBLIC_ROUTES.includes(pathname);


   useEffect(() => {
       // Usar un timeout para evitar problemas de navegación temprana
       const timeoutId = setTimeout(() => {
           devLog(`[useAuthGuard] Ruta: ${pathname}, Autenticado: ${isAuthenticated}, Pública: ${isPublicRoute}`);


           // Si no está autenticado y trata de acceder a una ruta protegida
           if (!isAuthenticated && !isPublicRoute) {
               devLog(`[useAuthGuard] Acceso denegado a ${pathname}, redirigiendo a login`);
               router.replace('/login');
               return;
           }


           // Si está autenticado y trata de acceder a rutas de autenticación (excepto index)
           if (isAuthenticated && (pathname === '/login' || pathname === '/recuperarPassword' || pathname === '/verificarCodigo' || pathname === '/cambiarPassword')) {
               devLog(`[useAuthGuard] Usuario autenticado intentando acceder a ${pathname}, redirigiendo a home`);
               router.replace('/homeScreen');
               return;
           }


           // Si está autenticado y está en index, redirigir a home
           if (isAuthenticated && pathname === '/') {
               devLog(`[useAuthGuard] Usuario autenticado en index, redirigiendo a home`);
               router.replace('/homeScreen');
               return;
           }
       }, 0);


       return () => clearTimeout(timeoutId);
   }, [pathname, isAuthenticated, isPublicRoute]);


   return {
       isAuthenticated,
       isPublicRoute,
       pathname
   };
};