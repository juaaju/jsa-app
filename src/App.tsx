import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/shared/Layout'
import JobInputPage from './pages/JobInputPage'
import RiskAnalysisPage from './pages/RiskAnalysisPage'
import RecommendedActionsPage from './pages/RecomendationPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-jsa" element={<JobInputPage />} />
          <Route path="/analysis" element={<RiskAnalysisPage />} />
          <Route path="/actions" element={<RecommendedActionsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App