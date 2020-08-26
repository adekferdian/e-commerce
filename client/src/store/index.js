import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
    carts: [],
    item: {},
    isLogin: false,
    username: '',
    balance: 0,
  },
  mutations: {
    SET_PRODUCTS(state, payload) {
      state.products = payload;
    },
    SET_CARTS(state, payload) {
      state.carts = payload;
    },
    SET_LOGGED(state, payload) {
      // this.username = payload.username
      state.isLogin = payload.isLogin;
      state.username = payload.username
      state.balance = payload.balance
    },
    SET_ITEM(state, payload) {
      state.item = payload;
    },
  },
  actions: {
    adding(context) {
      context.commit('SET_ISADD', true);
    },
    editing(context, payload) {
      context.commit('SET_ISEDIT', true);
      context.commit('SET_ITEM', payload);
    },
    cancel(context) {
      context.commit('SET_ISADD', false);
      context.commit('SET_ISEDIT', false);
    },
    userlogin(context, payload) {
      return new Promise((resolve, reject) => {
        const { email } = payload;
        const { password } = payload;
        return axios({
          method: 'POST',
          url: 'http://localhost:3000/login',
          data: {
            email,
            password,
          },
        })
          .then((result) => {
            console.log(result, '<<<');
            resolve(result.data);
            context.commit('SET_LOGGED', {payload: result.data, isLogin: true});
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    login(context, payload) {
      return new Promise((resolve, reject) => {
        const { email } = payload;
        const { password } = payload;
        return axios({
          method: 'POST',
          url: 'http://localhost:3000/admin/login',
          data: {
            email,
            password,
          },
        })
          .then((data) => {
            console.log(data, '<<<');
            resolve(data.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    logout(context) {
      localStorage.clear();
      context.commit('SET_LOGGED', false);
    },
    removeFromCart(context, payload) {
      return axios({
        method: 'delete',
        url: `http://localhost:3000/carts/${payload}`,
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      })
        .then(() => {
          context.dispatch('fetchCarts');
        })
        .catch(() => {
        });
    },
    register(context, payload) {
      const { email } = payload;
      const { password } = payload;
      return axios({
        method: 'POST',
        url: 'http://localhost:3000/register',
        data: {
          email,
          password,
        },
      })
        .then((data) => {
          localStorage.setItem('access_token', data.data.access_token);
          router.push('/');
          context.commit('SET_LOGGED', true);
        })
        .catch(() => {
        });
    },
    addToCart(context, payload) {
      axios({
        method: 'POST',
        url: 'http://localhost:3000/carts',
        data: {
          quantity: payload.quantity,
          ProductId: payload.id,
        },
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      })
        .then(() => {
        })
        .catch(() => {
        });
    },
    fetchProducts(context) {
      axios({
        method: 'GET',
        url: 'http://localhost:3000/products',
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      })
        .then(({ data }) => {
          context.commit('SET_PRODUCTS', data);
        })
        .catch(() => {
        });
    },
    fetchCarts(context) {
      axios({
        method: 'GET',
        url: 'http://localhost:3000/carts',
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      })
        .then(({ data }) => {
          console.log(data, '<<');
          context.commit('SET_CARTS', data);
        })
        .catch(() => {
        });
    },
    buyItem(context, payload) {
      console.log(payload);
      axios({
        method: 'put',
        url: 'http://localhost:3000/products/buy/'+ payload.productId,
        headers: {
          access_token: localStorage.access_token
        },
        data: {
          quantity: payload.quantity,
          cartId: payload.id
        }
      })
        .then(result => {
          console.log(result);
          context.dispatch('fetchCarts')
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  modules: {},
});
