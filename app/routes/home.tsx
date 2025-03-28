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
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <SetComponent username={loaderData.username} />
        <DeleteComponent />
      </div>
      <pre>{JSON.stringify({ loaderData }, null, 2)}</pre>
    </div>
  )
}

function DeleteComponent() {
  const fetcher = useFetcher()
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="action" value="delete-username" />
      <button
        className={
          'px-4 py-2 border border-gray-300/50  disabled:bg-gray-400/50 disabled:cursor-not-allowed rounded-md'
        }
      >
        Delete
      </button>
    </fetcher.Form>
  )
}

function SetComponent({ username }: { username: string }) {
  const fetcher = useFetcher()
  return (
    <fetcher.Form method="post" className="flex items-center gap-4">
      <input type="hidden" name="action" value="set-username" />
      <input
        type="text"
        name="username"
        defaultValue={username}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
      <button
        className={
          'px-4 py-2 border border-gray-300/50  disabled:bg-gray-400/50 disabled:cursor-not-allowed rounded-md'
        }
      >
        Set
      </button>
    </fetcher.Form>
  )
}
