import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  // Auth
  login: undefined;
  register: undefined;
  forgotPassword: undefined;
  resetPassword: { token: string };
  
  // Main Tabs
  '(tabs)': NavigatorScreenParams<TabParamList>;
  
  // Profile
  perfil: { userId?: string };
  editarPerfil: undefined;
  
  // Recipes
  'agregar-receta': undefined;
  'editar-receta': { recipeId: string };
  receta: { recipeId: string };
  
  // Admin
  admin: undefined;
  'admin/users': undefined;
  'admin/recipes': undefined;
  'admin/reports': undefined;
};

export type TabParamList = {
  homeScreen: undefined;
  buscar: undefined;
  'agregar-receta': undefined;
  favoritos: undefined;
  perfil: undefined;
};

// This allows type checking for route names
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
