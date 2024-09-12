import type { IColorsArr } from '@/types/product'
import type { IProduct } from '@/types/product'

import type { IPagination } from '@/types/global'
//import { URLSearchParams } from "@/api/product"
interface IResponseProducts {
  products: IProduct[]
}

export const getProducts = async (): Promise<IResponseProducts> => {
  try {
    const query = new URLSearchParams({
      //colorIds[]: array
    })
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/products?`)
    const response = await fetchResponse.json()
    const products: IProduct[] = response.items
    return {
      products: products
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const filterMinPrice = async (price: number) => {
  try {
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/products?minPrice=${price}`
    )
    const response = await fetchResponse.json()
    const products = response.items
    return {
      products: products
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}
export const filterMaxPrice = async (price: number) => {
  try {
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/products?maxPrice=${price}`
    )
    const response = await fetchResponse.json()
    const products = response.items
    return {
      products: products
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const filterColors = async (id: number) => {

  try {
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/products?colorIds[]=${id}`)
    const response = await fetchResponse.json()
    const products = response.items
    return {
      products: products
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const filterMaterials = async (id: number) => {
  try {
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/products?materialIds[]=${id}`
    )

    const response = await fetchResponse.json()
    const products = response.items
    return {
      products: products
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}
export const getColorIds = async () => {
  try {
    const query = new URLSearchParams({
      colorIds: String()
    })
    const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/products?${query}`)
    const response = await fetchResponse.json()
    return {
      response
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}
export const getSeasonIds = async (id: number) => {
  try {
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/products?seasonIds[]=${id}`
    )
    const response = await fetchResponse.json()
    const products = response.items
    return {
      products: products
    }
  } catch (err) {
    throw new Error('product response was not ok')
  }
}

export const getColors = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/colors?$`)
  const response = await fetchResponse.json()
  const colors = response
  return {
    colors: colors
  }
}
export const getCategory = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/productCategories?$`)
  const response = await fetchResponse.json()
  const colors = response
  return {
    colors: colors
  }
}

export const getCategoryId = async (id) => {
  try {
    const fetchResponse = await fetch(
      `https://vue-moire.skillbox.cc/api/products?categoryId=${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await fetchResponse.json()
    const products: IProduct[] = response.items;
    return products
  } catch (err) {
    throw new Error('product response was not ok')
  }
}
//https://vue-moire.skillbox.cc/api/products?categoryId=2
export const getMaterials = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/materials?$`)
  const response = await fetchResponse.json()
  const materials = response

  return {
    materials: materials
  }
}
export const getSeasons = async () => {
  const fetchResponse = await fetch(`https://vue-moire.skillbox.cc/api/seasons?$`)
  const response = await fetchResponse.json()
  const seasons = response
  return {
    seasons: seasons
  }
}
export const getProduct = async (id: any) => {
  const fetchResponse = await fetch('https://vue-moire.skillbox.cc/api/products/' + id)
  const response = await fetchResponse.json()
  const product = response

  return {
    product: product
  }
}
