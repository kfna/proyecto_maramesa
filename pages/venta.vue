<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'

export default {
  data () {
    return {
      productos: []
    }
  },
  async created () {
    await this.cargarProductos()
    this.$store.commit('inicializarCarrito')
  },
  mounted () {
    this.$store.commit('inicializarCarrito')
  },
  methods: {
    async logout () {
      const auth = getAuth()
      await signOut(auth)
      localStorage.removeItem('userToken')
      this.$router.push('/login_prueba')
    },
    async cargarProductos () {
      try {
        const db = getFirestore()
        const querySnapshot = await getDocs(collection(db, 'productos'))
        querySnapshot.forEach((doc) => {
          this.productos.push({ id: doc.id, ...doc.data() })
        })
      } catch (error) {
        console.error('Error al cargar productos:', error)
      }
    },
    async agregarAlCarrito (producto) {
      await this.$store.commit('agregarAlCarrito', producto)
      this.$set(producto, 'agregado', true)

      setTimeout(() => {
        this.$set(producto, 'agregado', false)
      }, 1000)
    },
    formatoPrecio (precio) {
      return precio.toLocaleString('es-MX')
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
    <div class="productos">
      <div v-for="producto in productos" :key="producto.id">
        <div class="card" style="width: 18rem;">
          <img :src="producto.imagen" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{ producto.nombre }}</h5>
            <p class="card-text">{{ producto.descripcion }}</p>
            <p class="card-text">${{ formatoPrecio(producto.precio) }}</p>
            <a href="#" class="btn btn-primary" @click.prevent="agregarAlCarrito(producto)">Agregar</a>
            <div v-if="producto.agregado" class="mensaje-confirmacion">
              Producto "{{ producto.nombre }}" agregado al carrito
            </div>
          </div>
        </div>
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
.card{
  margin: 50px 20px;
  height: 400px;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.05);
}
.productos{
  display: flex;
  flex-wrap: wrap;
  margin-left: 80px;
}
.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: contain;
}
.btn-primary{
  margin-bottom: 10px;
}
.mensaje-confirmacion {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #d6e9c6;
}
</style>
