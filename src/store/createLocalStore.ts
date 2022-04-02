import { createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ESCAPE_KEY, ENTER_KEY, LOCAL_STORAGE_KEY } from '../constants'
import { ShowMode } from '../enums'
import { Todo } from '../interfaces'

export interface LocalStoreParams {
  counter: number
  todos: Todo[]
  showMode: ShowMode
  editingTodoId: number
}

export default function createLocalStore(value: LocalStoreParams) {
  // load stored todos on init
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  const [state, setState] = createStore(stored ? JSON.parse(stored) : value)

  // JSON.stringify creates desps on every iterable field
  createEffect(() =>
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  )
  return [state, setState]
}
