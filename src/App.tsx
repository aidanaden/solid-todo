import { Component, createMemo, For, onCleanup, Show } from 'solid-js'
import createLocalStore from './store/createLocalStore'
import { ShowMode } from './enums'
import { Todo } from './interfaces'
import { ENTER_KEY, ESCAPE_KEY } from './constants'
import Header from './components/Header'

const App: Component = () => {
  const [state, setState] = createLocalStore({
    counter: 1,
    todos: [],
    showMode: ShowMode.ALL,
    editingTodoId: null,
  })

  // create cached signal storing number
  // todos not completed
  const remainingCount = createMemo(
    () => state.todos.length - state.todos.filter((t) => t.completed).length
  )

  // filter todos based on ShowMode value
  const filterList = (todos: Todo[]) => {
    if (state.showMode === ShowMode.ACTIVE)
      return todos.filter((t) => !t.completed)
    else if (state.showMode === ShowMode.COMPLETED)
      return todos.filter((t) => t.completed)
    else return todos
  }

  // remove todo with given todoId
  const removeTodo = (todoId: number) => {
    setState('todos', (todos) => todos.filter((t) => t.id !== todoId))
  }

  // replace todo with editedTodo
  const editTodo = (editedTodo: {
    id?: number
    title?: string
    completed?: boolean
  }) => {
    setState('todos', (todo) => todo.id === editedTodo.id, { ...editedTodo })
  }

  // remove all completed todos
  const clearCompleted = () => {
    setState('todos', (todos) => todos.filter((t) => !t.completed))
  }

  // set all todos completed state
  // to a specific value
  const toggleAll = (completed: boolean) => {
    setState('todos', (todo) => todo.completed !== completed, { completed })
  }

  // set id of todo currently being
  // edited to given todoId
  const setEditing = (todoId?: number) => {
    console.log('set editing triggered!')
    setState('editingTodoId', todoId)
  }

  // add todo to state
  const addTodo = ({ target, keyCode }) => {
    const title = target.value.trim()
    const nextConter = state.counter + 1
    if (keyCode == ENTER_KEY && title) {
      setState({
        todos: [{ title, id: nextConter, completed: false }, ...state.todos],
        counter: nextConter,
      })
      target.value = ''
    }
  }

  // update todo with new value
  const save = (todoId: number, e) => {
    const title = e.target.value.trim()
    if (todoId === state.editingTodoId && title) {
      editTodo({ id: todoId, title })
      setEditing()
    }
  }

  // update todo completed state with checked value
  const toggle = (todoId: number, e) => {
    console.log('toggle triggered!')
    editTodo({ id: todoId, completed: e.target.checked })
  }

  // end editing state with enter key
  const doneEditing = (todoId: number, e) => {
    if (e.target.value == ENTER_KEY) {
      save(todoId, e.target)
    } else if (e.target.value == ESCAPE_KEY) {
      setEditing()
    }
  }

  const setShowMode = (showMode: ShowMode) => {
    setState('showMode', showMode)
  }

  const locationHandler = () => {
    // set show mode based on current url value
    setState('showMode', location.hash.slice(2) || 'all')
    console.log()
  }

  window.addEventListener('hashchange', locationHandler)
  onCleanup(() => window.removeEventListener('hashchange', locationHandler))

  return (
    <section class="max-w-[550px] min-w-[230px] mx-auto" data-theme="dark">
      <Header
        addTodo={addTodo}
        remainingCount={remainingCount}
        toggleAll={toggleAll}
      />
      <Show when={state.todos.length > 0}>
        <ul class="w-full mt-4">
          <For each={filterList(state.todos)}>
            {(todo) => (
              <li>
                <div class="p-4 justify-between border-b-[1px] border-b-gray-600 flex flex-row bg-gray-700">
                  <div class="flex flex-row gap-x-4 self-center w-full">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      class="checkbox checkbox-md self-center"
                      onInput={[toggle, todo.id]}
                    />
                    <Show
                      when={state.editingTodoId === todo.id}
                      fallback={
                        <label
                          class="p-2"
                          classList={{ 'line-through': todo.completed }}
                          onDblClick={[setEditing, todo.id]}
                        >
                          {todo.title}
                        </label>
                      }
                    >
                      <input
                        class="outline-none bg-transparent p-2 w-full"
                        value={todo.title}
                        onFocusOut={[save, todo.id]}
                        onKeyUp={[doneEditing, todo.id]}
                      />
                    </Show>
                  </div>
                  <button
                    class="bg-transparent hover:text-gray-500 duration-200 border-none p-2 self-center"
                    onClick={[removeTodo, todo.id]}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <div
        class="flex flex-row px-4 py-2 justify-center
      bg-gray-700 rounded-b-lg border-gray-700 border-2
      relative"
      >
        <label class="self-center absolute left-4">{`${remainingCount()} item(s) left`}</label>
        <div class="flex flex-row gap-x-1 self-center align-middle">
          <For each={Object.values(ShowMode).reverse()}>
            {(showModeValue) => (
              <label class="label cursor-pointer space-x-2">
                <span class="label-text capitalize text-gray-400">
                  {showModeValue}
                </span>
                <input
                  type="radio"
                  name="radio-1"
                  class="radio checked:bg-gray-700"
                  checked
                  onClick={() => setShowMode(showModeValue)}
                />
              </label>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}

export default App
