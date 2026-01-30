import axios from "axios";

// Create axios instance
const api = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Assuming Bearer token format
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const loginUser = async (email, password) => {
    const response = await api.post("/verify/login", { email, password });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post("/verify/register", userData);
    return response.data;
};

export const fetchPublicArts = async () => {
    const response = await api.get("/art/public-arts");
    return response.data;
}

export const fetchMyArts = async () => {
    const response = await api.get("/art/get-arts");
    return response.data;
}

export const addToCart = async (artId, quantity = 1) => {
    const response = await api.post("/cart/add-cart", { artId, quantity });
    return response.data;
}

export const fetchCart = async () => {
    const response = await api.get("/cart/get-cart");
    return response.data;
}

export const removeFromCart = async (artId) => {
    // Axios delete with body requires explicit 'data' key or options object
    const response = await api.delete("/cart/delete-item", { data: { artId } });
    return response.data;
}

export const uploadArt = async (formData) => {
    const response = await api.post("/art/upload-file", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const deleteArt = async (artId) => {
    const response = await api.delete("/art/delete-art", { data: { artId } });
    return response.data;
}

export const updateArt = async (formData) => {
    const response = await api.put("/art/update-art", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const getArtById = async (id) => {
    // Note: If no specific single endpoint exists, we might need to filter from the list or add one.
    // For now, assuming we filter client side or backend adds one. 
    // Let's assume we fetch all and find one, or update backend later.
    // Ideally backend should have /art/:id. 
    // Checking routes, there isn't one clearly visible. using public arts for now.
    const response = await api.get("/art/public-arts");
    // This is inefficient but works without backend changes for now if list is small.
    // The component can filter.
    return response.data;
}


export default api;
