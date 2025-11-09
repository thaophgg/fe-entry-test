import UnitValue from "./components/UnitValue";

const App = () => {

  return (
    <div className="w-screen h-screen bg-[#303030] flex items-center justify-center text-neutral-100">
      <UnitValue onChange={console.log} />
    </div>
  )
}

export default App
