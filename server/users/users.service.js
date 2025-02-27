const axios = require('axios').default;

async function fetchAllUsers() {
  const { data: users } = await axios.get(
    'https://jsonplaceholder.typicode.com/users',
  );

  return users;
}
// Route to fetch user are https://jsonplaceholder.typicode.com/users/:userId
async function fetchUserById(userId) {
  try {
    const {data:data} = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching user with id ${userId}:`, error);
    return null;
  }
}

module.exports = { fetchAllUsers, fetchUserById };
