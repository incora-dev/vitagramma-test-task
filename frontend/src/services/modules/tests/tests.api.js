import { axiosInstance } from 'services/index.api';

export default {
  async getTests(params) {
    return axiosInstance.get('tests', { params })
  },
}