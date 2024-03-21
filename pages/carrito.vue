<script>
import { getAuth, signOut } from 'firebase/auth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '~/plugins/firebaseConfig'

export default {
  created () {
    this.$store.commit('inicializarCarrito')
    this.$store.commit('calcularTotal')
  },
  computed: {
    productos () {
      return this.$store.state.carrito
    },
    total () {
      return this.$store.state.total.toLocaleString('es-MX')
    }
  },
  methods: {
    async logout () {
      const auth = getAuth()
      await signOut(auth)
      localStorage.removeItem('userToken')
      this.$router.push('/login_prueba')
    },
    eliminarProducto (producto) {
      this.$store.commit('eliminarProducto', producto)
      this.$store.commit('calcularTotal')
    },
    vaciarCarrito () {
      this.$store.commit('vaciarCarrito')
      this.$store.commit('calcularTotal')
    },
    formatoPrecio (precio) {
      return precio.toLocaleString('es-MX')
    },
    async agregarAlCarrito (producto) {
      await this.$store.commit('agregarAlCarrito', producto)
      this.$store.commit('calcularTotal')
      producto.agregado = true
    },
    async guardarEnFirestore () {
      try {
        const carritoRef = collection(db, 'carritos')
        const fechaActual = new Date().toISOString()
        const data = {
          fecha: fechaActual,
          productos: this.$store.state.carrito
        }
        await addDoc(carritoRef, {
          ...data,
          fecha: serverTimestamp()
        })
        console.log('Datos del carrito guardados en Firestore correctamente')
        this.vaciarCarrito()
        alert('Los datos del carrito se han guardado correctamente en Firestore.')
      } catch (error) {
        console.error('Error al guardar en Firestore:', error)
        alert('Error al guardar los datos del carrito en Firestore. Por favor, inténtalo de nuevo.')
      }
    }
  }
}
</script>

<template>
  <div class="body">
    <header>
      <h2 class="tittle">Maramesa</h2>
      <nav>
        <ul>
          <nuxt-link to="/catalago" tag="div"><li class="menu">Catalago</li></nuxt-link>
          <nuxt-link to="/venta" tag="div"><li class="menu">Venta</li></nuxt-link>
          <li class="menu" @click="logout">Cerrar sesión</li>
          <nuxt-link to="/carrito" tag="div"><li class="menu">Carrito</li></nuxt-link>
        </ul>
      </nav>
    </header>
    <div class="carrito">
      <h1>Carrito</h1>
      <div class="card-carrito">
        <div v-if="productos.length === 0">No hay productos en el carrito</div>
        <div v-else>
          <div v-for="producto in productos" :key="producto.id" class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-4">
                <img :src="producto.imagen" class="img-fluid rounded-start" alt="Imagen del producto" />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">{{ producto.nombre }}</h5>
                  <p class="card-text">${{ formatoPrecio(producto.precio) }}</p>
                  <p class="card-text">Cantidad: {{ producto.cantidad }}</p>
                  <button @click="eliminarProducto(producto)" class="btn btn-danger">Eliminar</button>
                  <button @click="agregarAlCarrito(producto)" class="btn btn-success">Agregar</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="vaciarCarrito" class="btn btn-danger">Vaciar carrito</button>
          <button @click="guardarEnFirestore" class="btn btn-primary">Guardar en Firestore</button>
        </div>
        <strong><p class="total">Total: ${{ total }}</p></strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body{
  background-color:white;
  margin: 0;
  padding: 0;
}
header {
  background: #2a5298;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tittle {
  display: flex;
  margin-left: 10px;
  margin-bottom: 0;
  padding: 10px 10px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "Segoe UI Semibold", serif;
}
ul {
  margin: 0;
  padding: 0;
  display: flex;
}
li {
  font-family: "Segoe UI Semibold", serif;
  font-size: 18px;
  padding: 0 15px;
  color: white;
  margin-right: 30px;
  margin-left: 30px;
  list-style: none;
}
.menu:hover {
  color: #bfc2d8;
  cursor: pointer;
}
nav {
  margin-right: 80px;
}
.carrito{
  margin: 20px 50px;
}
.card-carrito{
  border: solid 2px #ced4da ;
  padding: 20px 50px;
  border-radius: 10px;
}
.total{
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
}
</style>
