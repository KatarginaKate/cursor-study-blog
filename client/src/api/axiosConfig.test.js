import axiosInstance from './axiosConfig'

describe('axiosConfig', () => {
  it('removes the stored token when the server returns 401', async () => {
    localStorage.setItem('token', 'secret')
    window.history.pushState({}, '', '/admin')

    const rejected = axiosInstance.interceptors.response.handlers[0].rejected
    await expect(rejected({ response: { status: 401 } })).rejects.toEqual({
      response: { status: 401 }
    })

    expect(localStorage.getItem('token')).toBeNull()
  })
})
