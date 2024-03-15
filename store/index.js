import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const state = () => ({
  carrito: [],
  authenticated: false,
  userToken: null,
  total: 0
})
export const mutations = {
  authenticate (state, token) {
    state.authenticated = true
    state.userToken = token
  },
  unauthenticate (state) {
    state.authenticated = false
    state.userToken = null
  },
  agregarAlCarrito (state, producto) {
    // Buscar si el producto ya está en el carrito
    const productoExistente = state.carrito.find(item => item.id === producto.id)

    if (productoExistente) {
      // Si el producto ya está en el carrito, incrementar su cantidad
      productoExistente.cantidad++
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      state.carrito.push({ ...producto, cantidad: 1 })
    } if (process.client) {
      localStorage.setItem('carrito', JSON.stringify(state.carrito))
    }
  },
  marcarComoAgregado (state, producto) {
    // Aquí va tu lógica para marcar el producto como agregado
    producto.agregado = true
  },
  eliminarProducto (state, producto) {
    const productoExistenteIndex = state.carrito.findIndex(item => item.id === producto.id)

    if (productoExistenteIndex !== -1) {
      // Si el producto existe en el carrito
      const productoExistente = state.carrito[productoExistenteIndex]
      if (productoExistente.cantidad > 1) {
        // Si la cantidad del producto es mayor que 1, disminuir la cantidad
        productoExistente.cantidad--
      } else {
        // Si la cantidad del producto es igual a 1, eliminar el producto del carrito
        state.carrito.splice(productoExistenteIndex, 1)
      }

      // Actualizar el almacenamiento local después de eliminar un producto del carrito
      if (process.client) {
        localStorage.setItem('carrito', JSON.stringify(state.carrito))
      }
    }
  },
  vaciarCarrito (state) {
    state.carrito = []
    if (process.client) {
      localStorage.removeItem('carrito')
    }
  },
  calcularTotal (state) {
    state.total = state.carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad)
    }, 0)
  },
  inicializarCarrito (state) {
    if (process.client) {
      const carritoLocal = localStorage.getItem('carrito')
      if (carritoLocal) {
        state.carrito = JSON.parse(carritoLocal)
      }
    }
  }
}
