import { axiosInstance } from 'services/index.api';

export default {
  async getGroups(params) {
    return axiosInstance.get('groups', { params })
  },

  async search(testIds) {
    return axiosInstance.post('groups/best-price', { testIds })
  },
}