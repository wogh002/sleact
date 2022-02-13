import axios from 'axios';
// url 은 useSWR('http://localhost:3095/api/users/', fetcher);
// 3095 url 이 fetcher 매개변수로 넘어간다
const fetcher = (url: string) => {
  console.log('fetcher 함수 실행');
  return axios.get(url, { withCredentials: true }).then((response) => response.data);
};

export default fetcher;
