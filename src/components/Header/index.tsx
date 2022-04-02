export default function index(props) {
  return (
    <header class="mb-4">
      <h1 class="w-full text-center text-7xl py-8 text-gray-300">todos</h1>
      <div class="relative">
        <input
          class="input input-bordered w-full p-8 pr-16 text-lg"
          placeholder="Enter new task..."
          onKeyDown={props.addTodo}
        />
        <input
          type="checkbox"
          checked={!props.remainingCount()}
          class="checkbox checkbox-md absolute right-6 top-1/3"
          onInput={(e) =>
            props.toggleAll((e.target as HTMLInputElement).checked)
          }
        />
      </div>
    </header>
  )
}
