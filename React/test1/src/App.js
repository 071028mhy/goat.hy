import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlanProvider } from './PlanContext';
import { UserProvider } from './UserContext';
import Login from './Login';
import Home from './Home';
import Settings from './Settings';
import History from './History';
import MyPage from './MyPage';
import NewPlan from './NewPlan';
import MyCalendar from './MyCalendar';

function App() {
  return (
    <UserProvider>
      <PlanProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<History />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/newplan" element={<NewPlan />} />
            <Route path="/mycalendar" element={<MyCalendar />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </PlanProvider>
    </UserProvider>
  );
}

export default App;