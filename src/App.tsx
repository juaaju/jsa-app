// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import L2SAInputPage from './pages/L2SA/L2SAInputPage'
import RiskAnalysisPage from './pages/L2SA/RiskAnalysisPage'
import RecommendedActionsPage from './pages/L2SA/RecomendationPage'
import HomePage from './pages/L2SA/JSAHomePage'
import LoginPage from './pages/LoginPage'
import MainLayoutWrapper from './components/shared/MainLayoutWrapper';
import RiskRegisterPage from './pages/HSE/RiskRegisterPage'
import HazardListPage from './pages/HSE/HazardListPage'
import TopRiskAnalysisPage from './pages/HSE/TopRiskPage'
import L2SAApprovalPage from './pages/Management/L2SAApprovalPage'
import DashboardPage from './pages/DashboardPage'
import TaskHazardAssessmentPage from './pages/L2SA/THAPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route with no layout */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* All other routes with the MainLayoutWrapper */}
        <Route path="/" element={<MainLayoutWrapper><DashboardPage /></MainLayoutWrapper>} />
        <Route path="/jsa-home/*" element={<MainLayoutWrapper><HomePage /></MainLayoutWrapper>} />
        <Route path="/new-l2sa" element={<MainLayoutWrapper><  L2SAInputPage /></MainLayoutWrapper>} />
        <Route path="/analysis" element={<MainLayoutWrapper><RiskAnalysisPage /></MainLayoutWrapper>} />
        <Route path="/actions" element={<MainLayoutWrapper><RecommendedActionsPage /></MainLayoutWrapper>} />
        <Route path="/risk-register/*" element={<MainLayoutWrapper><RiskRegisterPage /></MainLayoutWrapper>} />
        <Route path="/hazard-list" element={<MainLayoutWrapper><HazardListPage /></MainLayoutWrapper>} />
        <Route path="/top-risk-analysis" element={<MainLayoutWrapper><TopRiskAnalysisPage /></MainLayoutWrapper>} />
        <Route path="/l2sa-approvals" element={<MainLayoutWrapper><L2SAApprovalPage /></MainLayoutWrapper>} />
        <Route path="/tha" element={<MainLayoutWrapper><TaskHazardAssessmentPage /></MainLayoutWrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;