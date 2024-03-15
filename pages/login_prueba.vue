<template>
  <div class="body">
    <header>
      <h2 class="tittle">Maramesa</h2>
    </header>
    <div class="container-all">
      <div class="container">
        <div class="form">
          <h2>Inicio de sesion</h2>
          <section>
            <form @submit.prevent="login">
              <label class="text" for="username">Ingrese su usuario</label>
              <input id="username" v-model="username" class="box" type="text" name="username">
              <label class="text" for="password">Ingrese su contraseña</label>
              <input id="password" v-model="password" class="box" type="password" name="password">
              <button type="submit">
                Iniciar Sesión
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/default
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from 'firebase/auth'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login () {
      try {
        const auth = getAuth()
        await setPersistence(auth, browserSessionPersistence)
        const userCredential = await signInWithEmailAndPassword(auth, this.username, this.password)
        console.log('Usuario autenticado:', userCredential.user)
        const token = await userCredential.user.getIdToken()
        localStorage.setItem('userToken', token)
        this.$store.commit('authenticate')
        await this.$router.push('./catalago')
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
        alert('Contraseña y/o correo electrónico incorrecto')
      }
    }
  }
}
</script>

<style scoped>
.body{
  background-color: #b0c4de;
  margin: 0;
  padding: 0;
  height: 100vh;
}
header {
  background: #2a5298;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
}
.tittle {
  display: flex;
  margin-left: 10px;
  padding: 10px 10px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "Segoe UI Semibold", serif;
}
.container-all{
  margin: 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  height: 595px;
  position: relative;
}
.container{
  position: absolute;
  inset: 0;
  margin: auto;
  height: 400px;
  width: 500px;
  background: white;
  box-sizing: border-box;
  border-radius: 10px;
}
.form{
  padding: 20px;
}
h2 {
  margin: 0;
  padding-top: 10px;
  text-align: center;
  font-family: "Arial", serif;
  font-weight: bold;
}
section {
  padding: 30px 0;

}
.text {
  font-family: "Inter", Arial,serif;
  opacity: 0.6;
}
.box {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 7px;
  width: 439px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #ececec;
  color: #333;
  transition: border-color 0.3s ease;
}

.box:focus {
  outline: none;
  box-shadow: 0 0 5px #1F7BD0;
  border-color: #1F7BD0;
}

.box:hover {
  border-color: #666;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 35px;
  background: #2a5298;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background:#14568B;
}

button:active {
  background: #0E416C;
}
</style>
