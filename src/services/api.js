import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/token'
import { host } from '../config';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function queryArticleList(params) {
  // console.log(getToken())
  return request(host + '/jmht/api/article/list', {
    headers: { token: getToken() }
  });
}

export async function queryCategoryList() {
  // console.log(getToken())
  return request(host + '/jmht/api/product/category/list', {
    headers: { token: getToken() }
  });
}

export async function saveArticle(params) {
  return request(host + "/jmht/api/article/add", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function updateArticle(params) {
  return request(host + "/jmht/api/article/update", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function deleteArticle(params) {
  return request(host + "/jmht/api/article/delete", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function addLike(params) {
  return request(host + "/jmht/api/article/addLike", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function addProductCategory(params) {
  return request(host + "/jmht/api/product/category/add", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function createProduct(params) {
  return request(host + "/jmht/api/product/add", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function removeProduct(params) {
  return request(host + "/jmht/api/product/remove", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function listProduct() {
  return request(host + "/jmht/api/product/list", {
    headers: { token: getToken() }
  })
}

export async function removeProductCategory(params) {
  return request(host + "/jmht/api/product/category/remove", {
    headers: { token: getToken() },
    method: "POST",
    body: params
  })
}

export async function uploadImage(data) {
  return request(host + "/jmht/api/uploadImage", {
    headers: { token: getToken()},
    method: "POST",
    body: data
  })
}


export async function fakeAccountLogin(params) {
  return request(host + '/jmht/api/user/login', {
    method: 'POST',
    body: params
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
