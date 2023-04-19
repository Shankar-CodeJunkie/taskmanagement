import axios from "axios";


export function postService(service, contextPath, payload) {
  console.log('hey payload', payload);
  return new Promise((resolve, reject) => {
    return axios({
      method: 'POST',
      url: contextPath,
      data: payload,
      responseType: 'json',
      timeout: 20000,
      cache: false,
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data)
      } else {
        resolve({status: response.status})
      }
    }).catch(error => {
      console.log(" Error => " + JSON.stringify(error));
      resolve({status: "500"})
    })
  })
}

export function getService(service, contextPath, payload) {
  return new Promise((resolve, reject) => {
    return axios({
      method: 'get',
      url: contextPath,
      data: payload,
      responseType: 'json',
      timeout: 20000,
      cache: false,
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data)
      } else {
        resolve({status: response.status})
      }
    }).catch(error => {
      console.log(" Error => " + JSON.stringify(error));
      resolve({status: "500"})
    })
  })
}

export function deleteService(service, contextPath, payload) {
  return new Promise((resolve, reject) => {
    return axios({
      method: 'delete',
      url: contextPath,
      data: payload,
      responseType: 'json',
      timeout: 20000,
      cache: false
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data)
      } else {
        resolve({status: response.status})
      }
    }).catch(error => {
      console.log("Error : " + JSON.stringify(error))
      reject(error)
    })
  })
}
