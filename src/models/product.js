import { addProductCategory, queryCategoryList, removeProductCategory, createProduct, uploadImage, removeProduct, listProduct } from '../services/api';

export default {
  namespace: 'product',

  state: {
    categories: [{ id: 1, name: "奶茶" }, { id: 2, name: "软欧包" }],
    products: []
  },
  effects: {
    *getCategoryList(_, { call, put }) {
      const response = yield call(queryCategoryList)
      if (response.hasOwnProperty('Data')) {
        yield put({
          type: 'productCategory',
          payload: {
            categories: response.Data.list
          }
        })
      }
    },
    *saveCategory({ payload }, { call, put }) {
      console.log(payload)
      yield call(addProductCategory, { name: payload.name });

      // get
      const response = yield call(queryCategoryList)
      if (response.hasOwnProperty('Data')) {
        yield put({
          type: 'productCategory',
          payload: {
            categories: response.Data.list
          }
        })
      }
    },
    *listProduct(_, { call, put }) {
      const res1 = yield call(listProduct)
      // console.log(res1)
      if (res1.hasOwnProperty('Data')) {
        yield put({
          type: 'product',
          payload: {
            products: Array.isArray(res1.Data.products) ? res1.Data.products : []
          }
        })
      }
    },
    *removeProduct({ payload }, { call, put }) {
      const res1 = yield call(removeProduct, { name: payload.name, description: payload.desc, category_id: payload.c_id })

      yield call(uploadImage, {})
    },
    *addProduct({ payload }, { call, put }) {
      console.log(payload)
      const res1 = yield call(createProduct, { name: payload.name, description: payload.desc, category_id: payload.category_id })
      console.log("create product res -> ", res1)

      const imagePostData = {
        file: payload.fileData,
        file_type: payload.fileType,
        product_id: res1.Data.product.ID
      }
      const imageUploadRes = yield call(uploadImage, imagePostData)
      console.log(imageUploadRes)

      const res2 = yield call(listProduct)
      console.log(res2)
      yield put({
        type: 'product',
        payload: {
          products: res2.Data.products
        }
      })
      // yield call(listProduct)
      // yield call(uploadImage, {  })
    },
    *removeCategory({ payload }, { call, put }) {
      yield call(removeProductCategory, { id: payload.id })
      const response = yield call(queryCategoryList)
      if (response.hasOwnProperty('Data')) {
        yield put({
          type: 'productCategory',
          payload: {
            categories: response.Data.list
          }
        })
      }
    }
  },
  reducers: {
    productCategory(state, action) {
      return {
        ...state,
        categories: action.payload.categories,
      };
    },
    product(state, action) {
      return {
        ...state,
        products: action.payload.products
      }
    }
  },
};
