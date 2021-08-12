export async function getMe() {
  const response = await fetch(`http://localhost:3000/api/user/me`, {
    credentials: 'include'
  });
  return await response.json();
}

export async function subscription(isSubscribed: boolean) {
  const data = { isSubscribed: isSubscribed }
  const response = await fetch(`http://localhost:3000/api/user/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  const res = await response.json()
  console.log(res);
  return res;
}