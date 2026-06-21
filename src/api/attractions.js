import api from './client.js'

export const getAttractions = (params) => api.get('/attractions', { params })
export const getAttraction  = (id)     => api.get(`/attractions/${id}`)
