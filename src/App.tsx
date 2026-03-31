import { Navigate, Route, Routes } from 'react-router-dom'
import { MainNav } from './components/MainNav'
import { ArenaPage } from './pages/ArenaPage'
import { CharacterPage } from './pages/CharacterPage'
import { HomePage } from './pages/HomePage'
import { TasksPage } from './pages/TasksPage'
import './App.css'

function App() {
    return (
        <div className="app-root">
            <MainNav />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tareas" element={<TasksPage />} />
                <Route path="/personaje" element={<CharacterPage />} />
                <Route path="/arena" element={<ArenaPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
