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
    <div class="container-agregar-productos">
      <div class="mb-3">
        <h2 class="tittle-productos">Agregar Productos</h2>
        <input v-model="nombre" type="text" class="form-control" id="nombre" placeholder="Nombre">
        <input v-model="descripcion" type="text" class="form-control" id="descripcion" placeholder="Descripción">
        <input v-model="precio" type="text" class="form-control" id="precio" placeholder="Precio">
        <input v-model="imagen" type="text" class="form-control" id="imagen" placeholder="URL Imagen">
        <div class="col-auto">
          <button  @click="guardarProducto" type="submit" class="btn btn-primary mb-3">Guardar</button>
        </div>
      </div>
      <div>
        <h2>Lista de Productos</h2>
        <table class="table">
          <thead class="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="index">
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.descripcion }}</td>
              <td>${{ formatoPrecio(producto.precio) }}</td>
              <td class="image">{{ producto.imagen }}</td>
              <td class="button">
                <button class="btn btn-primary" @click="editarProducto(producto)">Editar</button>
                <button class="btn btn-danger" @click="eliminarProducto(producto)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'

export default {
  data () {
    return {
      productos: [],
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      productoSeleccionado: {}
    }
  },
  async created () {
    const db = getFirestore()
    const querySnapshot = await getDocs(collection(db, 'productos'))

    querySnapshot.forEach((doc) => {
      this.productos.push({ id: doc.id, ...doc.data() })
    })
    if (!localStorage.getItem('userToken')) {
      return
    }
    await this.actualizarProductos()
  },
  methods: {
    async logout () {
      const auth = getAuth()
      await signOut(auth)
      localStorage.removeItem('userToken')
      this.$router.push('/login_prueba')
    },
    formatoPrecio (precio) {
      return precio.toLocaleString('es-MX')
    },
    async eliminarProducto (producto) {
      const db = getFirestore()
      await deleteDoc(doc(db, 'productos', producto.id))
      this.productos = this.productos.filter(item => item.id !== producto.id)
    },
    editarProducto (producto) {
      this.productoSeleccionado = producto
      this.nombre = producto.nombre
      this.descripcion = producto.descripcion
      this.precio = producto.precio
      this.imagen = producto.imagen
      console.log('Editar:', producto)
    },
    async guardarProducto () {
      try {
        const db = getFirestore()
        const precioNumerico = Number.parseFloat(this.precio)
        if (this.productoSeleccionado.id) {
          await updateDoc(doc(db, 'productos', this.productoSeleccionado.id), {
            nombre: this.nombre || '',
            descripcion: this.descripcion || '',
            precio: precioNumerico || 0,
            imagen: this.imagen || ''
          })
          console.log('Producto editado correctamente')
        } else {
          await addDoc(collection(db, 'productos'), {
            nombre: this.nombre || '',
            descripcion: this.descripcion || '',
            precio: precioNumerico || 0,
            imagen: this.imagen || ''
          })
          console.log('Producto guardado correctamente')
        }
        this.nombre = ''
        this.descripcion = ''
        this.precio = ''
        this.imagen = ''
        await this.actualizarProductos()
      } catch (error) {
        console.error('Error al guardar/editar el producto:', error)
      }
    },
    async actualizarProductos () {
      try {
        const db = getFirestore()
        const querySnapshot = await getDocs(collection(db, 'productos'))
        this.productos = []
        querySnapshot.forEach((doc) => {
          this.productos.push({ id: doc.id, ...doc.data() })
        })
      } catch (error) {
        console.error('Error al actualizar la lista de productos:', error)
      }
    }
  }
}
</script>

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
.container-agregar-productos{
  margin-left: 60px;
  margin-top: 20px;
}
.form-control{
  width: 80%;
  margin: 20px 0;
  border: solid 1px #6c757d;
}
.table{
 width: 90%;
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
.button{
  display: flex;
  flex-direction: row;
}
.btn-primary{
  margin-right: 10px;
}
.image{
  padding-right: 20px;
  margin-right: 10px;
  max-width: 250px;
  word-wrap: break-word;
}
.table tbody tr {
  border-bottom: 1px solid #dee2e6;
}
.button{
  border-style: none;
}

.button button {
  margin-top: 5px;
}

</style>
