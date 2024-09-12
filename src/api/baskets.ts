import type { IProduct, IObjectData } from '@/types/product'
import { useBasketStore } from '@/stores/basket'

import { ref, watch } from 'vue'
const basket = useBasketStore()
const key = ref('')
const keyInLocalStorage = localStorage.getItem('key')
if (keyInLocalStorage && keyInLocalStorage !== 'undefined') {
  key.value = JSON.parse(keyInLocalStorage).value
}

watch(
  () => key.value,
  () => {
    localStorage.setItem('key', JSON.stringify(key.value))
  },
  { deep: true }
)

export const getAccessKey = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/users/accessKey`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  const response = await fetchResponse.json()

  key.value = response.accessKey
  return response.accessKey
}
export const postBaskets = async (object) => {
  try {
    const query = new URLSearchParams({
      userAccessKey: String(basket.key)
    })
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/baskets/products?${query}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: object.productId,
          colorId: object.colorId,
          sizeId: object.sizeId,
          quantity: object.quantity
        })
      }
    )

    const res = await fetchResponse.json()
    return res
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const putBaskets = async (object) => {
  try {
    const query = new URLSearchParams({
      userAccessKey: String(basket.key)
    })
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/baskets/products?${query}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basketItemId: object.basketItemId,
          quantity: object.quantity
        })
      }
    )
    const res = await fetchResponse.json()
    return res
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const deleteBaskets = async (id: number) => {
  try {
    const query = new URLSearchParams({
      userAccessKey: String(key.value)
    })
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/baskets/products?${query}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basketItemId: id
        })
      }
    )
    const res = await fetchResponse.json()
    return res
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const getBaskets = async () => {
  try {
    const query = new URLSearchParams({
      userAccessKey: String(basket.key)
    })
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/baskets?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const response = await fetchResponse.json()
    const products: IProduct[] = response.items
    return products
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const postOrder = async (object) => {
  try {
    const query = new URLSearchParams({
      userAccessKey: String(key.value)
    })

    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/orders?${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: object.name,
        address: object.address,
        phone: object.phone,
        email: object.email,
        deliveryTypeId: object.deliveryTypeId,
        paymentTypeId: object.deliveryTypeId,
        comment: object.name
      })
    })

    const response = await fetchResponse.json()
    basket.orderId = response.id
    return response
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const getDeliveries = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/deliveries`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  const response = await fetchResponse.json()
  return response
}

export const getPayments = async (deliveryTypeId) => {
  try {
    const query = new URLSearchParams({
      deliveryTypeId: String(deliveryTypeId.value)
    })
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/payments?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const response = await fetchResponse.json()

    return response
  } catch (err) {
    throw new Error('product response was not ok')
  }
}
export const getOrderId = async (orderId) => {
  try {
    const query = new URLSearchParams({
      userAccessKey: String(key.value)
    })
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/orders/${orderId.value}?${query}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await fetchResponse.json()
    return response
  } catch (err) {
    throw new Error('product response was not ok')
  }
}
