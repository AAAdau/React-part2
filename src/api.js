const BASE_URL = 'http://localhost:3001'; // JSON Server 的基础 URL

export const getImages = () =>
    fetch(`${BASE_URL}/images`).then(response => response.json());

// 获取所有产品
export const getProducts = () =>
    fetch(`${BASE_URL}/products`).then(response => response.json());

// 获取购物车内容
export const getAllCart = () =>
    fetch(`${BASE_URL}/cart`).then(response => response.json());
export const getCart = (userId) =>
    fetch(`${BASE_URL}/cart?userId=${userId}`).then(response => response.json());

// 添加产品到购物车
export const addToCart = (item) =>
    fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    }).then(response => response.json());

// 更新购物车中的产品数量
export const updateCart = (item) =>
    fetch(`${BASE_URL}/cart/${item.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    }).then(response => response.json());

export const deleteCartItem = (id) =>
    fetch(`${BASE_URL}/cart/${id}`, {
        method: 'DELETE',
    });

export const getFav = (userId) =>
    fetch(`${BASE_URL}/favorites?userId=${userId}`).then(response => response.json());

export const addToFav = (item) =>
    fetch(`${BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    }).then(response => response.json());

export const deleteFromFav = (id) =>
    fetch(`${BASE_URL}/favorites/${id}`, {
        method: 'DELETE',
    });

export const updateFav = (item) =>
    fetch(`${BASE_URL}/favorites/${item.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    }).then(response => response.json());

// 用户登录
export const loginUser = (email, password) =>
    fetch(`${BASE_URL}/users?email=${email}&password=${password}`)
        .then(response => response.json());

export const signUpUser = (username, email, password) =>
    fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    }).then(response => response.json());


export const checkEmailExists = (email) =>
    fetch(`${BASE_URL}/users?email=${email}`)
        .then(response => response.json())
        .then(users => users.length > 0);

