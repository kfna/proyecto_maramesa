// authenticated.js
export default function ({ store, redirect }) {
  // Si el usuario no está autenticado
  if (!store.state.authenticated) {
    return redirect('/login_prueba')
  }
}
