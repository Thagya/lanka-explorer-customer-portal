import api from './client.js'

export const getListings = (params) => api.get('/listings', { params })
export const getListing  = (id)     => api.get(`/listings/${id}`)
