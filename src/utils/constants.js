let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8889'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-x4te.onrender.com'
}
export const API_ROOT = apiRoot