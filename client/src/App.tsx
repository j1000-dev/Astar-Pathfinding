import './index.css';
import Pathfinding from '@/components/Pathfinding';

function App() {
  return (
    <div className="flex flex-col items-center p-10">
      <div className="text-2xl font-bold underline p-5 tracking-wider">A* Pathfinding Visualizer</div>
      <Pathfinding />
    </div>
  )
}



export default App