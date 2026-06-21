import api from './client.js'

export const getMyBookings  = ()              => api.get('/bookings/my')
export const getBooking     = (id)            => api.get(`/bookings/${id}`)
export const createBooking  = (data)          => api.post('/bookings', data)
export const transitionBooking = (id, data)   => api.patch(`/bookings/${id}`, data)
