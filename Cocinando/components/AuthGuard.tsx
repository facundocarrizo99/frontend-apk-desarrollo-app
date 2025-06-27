import { router, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { devLog } from '../utils/config';
import { UserManager } from '../utils/userManager';


interface AuthGuardProps {
   children: React.ReactNode;
}


// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = [
   '/',
   '/index',
   '/login',
   '/recuperarPassword',
   '/verificarCodigo',
   '/cambiarPassword'
];


export default function AuthGuard({ children }: AuthGuardProps) {
   const pathname = usePathname();
   const isAuthenticated = UserManager.isAuthenticated();
   const isPublicRoute = PUBLIC_ROUTES.includes(pathname);


   useEffect(() => {
       // Usar requestAnimationFrame para asegurar que el layout esté montado
       const checkAuth = () => {
           devLog(`[AuthGuard] Ruta: ${pathname}, Autenticado: ${isAuthenticated}, Pública: ${isPublicRoute}`);


           // Si no está autenticado y trata de acceder a una ruta protegida
           if (!isAuthenticated && !isPublicRoute) {
               devLog(`[AuthGuard] Acceso denegado a ${pathname}, redirigiendo a login`);
               router.replace('/login');
               return;
           }


           // Si está autenticado y trata de acceder a rutas de autenticación (excepto index)
           if (isAuthenticated && (pathname === '/login' || pathname === '/recuperarPassword' || pathname === '/verificarCodigo' || pathname === '/cambiarPassword')) {
               devLog(`[AuthGuard] Usuario autenticado intentando acceder a ${pathname}, redirigiendo a home`);
               router.replace('/homeScreen');
               return;
           }


           // Si está autenticado y está en index, redirigir a home
           if (isAuthenticated && pathname === '/') {
               devLog(`[AuthGuard] Usuario autenticado en index, redirigiendo a home`);
               router.replace('/homeScreen');
               return;
           }
       };


       // Usar requestAnimationFrame para diferir la navegación
       const rafId = requestAnimationFrame(checkAuth);
      
       return () => {
           cancelAnimationFrame(rafId);
       };
   }, [pathname, isAuthenticated, isPublicRoute]);


   // Renderizar el contenido siempre
   return <>{children}</>;
}