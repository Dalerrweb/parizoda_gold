import axios from 'axios';

const MULTICARD_AUTH_URL = 'https://dev-mesh.multicard.uz/auth';

export async function getMulticardToken() {
  const res = await axios.post(MULTICARD_AUTH_URL, {
    application_id: process.env.MULTICARD_APP_ID,
    secret: process.env.MULTICARD_SECRET
  });

  return res.data.token;
}
