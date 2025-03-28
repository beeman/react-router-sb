import { createCookie, redirect } from 'react-router'

export const testUsernameCookie = createCookie('test-username')

export async function deleteUsernameCookie(request: Request) {
  console.log('deleteUsernameCookie: deleting cookie')
  return redirect('/', {
    headers: {
      'Set-Cookie': await testUsernameCookie.serialize(''),
    },
  })
}

export async function setUsernameCookie(request: Request, formData: FormData) {
  const username = formData.get('username')
  if (!username) {
    console.log('setUsernameCookie: no username')
    return
  }
  console.log(`setUsernameCookie: ${username}`)
  return redirect('/', {
    headers: {
      'Set-Cookie': await testUsernameCookie.serialize(username),
    },
  })
}
