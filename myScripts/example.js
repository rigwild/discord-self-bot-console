// @ts-check
const { api } = require('../index.js')

// Copy paste the below code inside the Discord console
;(async () => {
  const user = await api.getCurrentUser()

  console.log(user.username)
})()
