export interface IProduct {
  id: number
  title: string
  price: number
  slug: string
  colors: [
    {
      id: number
      color: {
        id: number
        title: string
        code: string
      }
      gallery: {
        file: {
          url: string
        }
      }
    }
  ]

  seasons: {
    id: number
    title: string
    code: string
    productsCount: number
  }

  materials: [
    {
      id: number
      title: string
      code: string
      productsCount: number
    }
  ]
}

export interface IProductBig {
  id: number
  title: string
  price: number
  slug: string
  content: string
  colors: [
    {
      id: number
      color: {
        id: number
        title: string
        code: string
      }
      gallery: {
        file: {
          url: string
        }
      }
    }
  ]

  seasons: {
    id: number
    title: string
    code: string
    productsCount: number
  }

  materials: [
    {
      id: number
      title: string
      code: string
      productsCount: number
    }
  ]
  category: {
    id: number
    title: string
    slug: string
  }
  sizes: [
    {
      id: number
      title: string
    }
  ]
}
export interface IColor {
  id: number
  name: string
  value: string
}
export interface IColors {
  id: number
  color: {
    id: number
    title: string
    code: string
  }
  gallery: {
    file: {
      url: string
    }
  }
}
export interface IMaterials {
  id: number
  title: string
  code: string
  productsCount: string
}
export interface Iseasons {
  id: number
  title: string
  code: string
  productsCount: string
}

export interface IColorsArr {
  id: number
  title: string
  code: string
}

export interface ICategoryProducts {
  id: number
  title: string
  slug: string
}
export interface ISize {
  id: number
  title: string
}

export interface IPicture {
  id: number
  src: {}
}
export interface IObject {
  code: string
  color: string
  colorEn: string
  id: number
  name: string
  productPrice: number
  quantity: number
  url: string
}
export interface IObj {
  code: string
  color: {
    id: number
    color: {
      id: number
      title: string
      code: string
    }
    gallery: [
      {
        file: {
          url: string
        }
      }
    ]
  }
  id: number
  price: number
  name: string
  quantity: number
  size: number
}
export interface IObjectData {
  name: string
  address: string
  phone: string
  email: string
  deliveryTypeId: number
  paymentTypeId: number
  comment: string
}
export interface IArrayDelivery {
  id: number
  title: string
  price: number
}
export interface IPrice {
  products: [
    
  ]
}
