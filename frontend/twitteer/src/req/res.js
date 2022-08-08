import axios from 'axios'
const {data: api} = await axios.get('http://localhost:8080/api/users')
export {data}
