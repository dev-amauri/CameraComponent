import axios from './axios';

const api = {
  ocr: {
    postOCR(data) {
      return axios.post('/api/upload-ine-image/', data);
    },
  }
};

export default api;
