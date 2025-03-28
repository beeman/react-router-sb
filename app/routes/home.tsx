import { deleteUsernameCookie, getUsernameCookie, setUsernameCookie } from '~/cookie.server'
import type { Route } from './+types/home'
import { useFetcher } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export async function loader({ request }: Route.LoaderArgs) {
  const username = await getUsernameCookie(request)
  console.log(`loader => testUsernameCookie cookie: ${username?.length ? username : '*NONE*'}`)
  return { username: username?.length ? username : '' }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  if (!formData.has('action')) {
    console.log('no action')
    return
  }
  switch (formData.get('action')) {
    case 'delete-username':
      console.log('deleting username cookie')
      return deleteUsernameCookie(request)
    case 'set-username':
      console.log('setting username cookie')
      return await setUsernameCookie(request, formData)
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <SetComponent username={loaderData.username} />
      <DeleteComponent />

      <pre>{JSON.stringify({ loaderData }, null, 2)}</pre>
    </main>
  )
}

function DeleteComponent() {
  const fetcher = useFetcher()
  return (
    <article>
      <fetcher.Form method="post">
        <input type="hidden" name="action" value="delete-username" />
        <button>Delete</button>
      </fetcher.Form>
    </article>
  )
}

function SetComponent({ username }: { username: string }) {
  const fetcher = useFetcher()
  return (
    <article>
      <fetcher.Form method="post">
        <input type="hidden" name="action" value="set-username" />
        <input type="text" name="username" defaultValue={username} />
        <button>Set</button>
      </fetcher.Form>
    </article>
  )
}
