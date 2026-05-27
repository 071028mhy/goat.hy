import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const NAV_ITEMS = [
  { label: "새 모임", icon: "+" },
  { label: "내 일정", icon: "📅" },
  { label: "참여 기록", icon: "🕐" },
  { label: "마이페이지", icon: "👤" },
];

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width: 44, height: 24, borderRadius: 12,
      background: on ? "#3b6ef8" : "#444",
      position: "relative", cursor: "pointer",
      transition: "background 0.2s",
    }}>
      <div style={{
        position: "absolute", top: 2,
        left: on ? 22 : 2,
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
      }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
        {title}
      </div>
      <div style={{
        background: "#1a1a1a", borderRadius: 12,
        border: "1px solid #2a2a2a", overflow: "hidden"
      }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, action, actionColor = "#3b6ef8", toggle, onToggle, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: last ? "none" : "1px solid #2a2a2a",
    }}>
      <span style={{ fontSize: 14, color: "#ddd" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {value && <span style={{ fontSize: 14, color: "#666" }}>{value}</span>}
        {action && (
          <span onClick={() => alert(`${label} 기능 준비 중입니다!`)} style={{
            fontSize: 14, color: actionColor, cursor: "pointer", fontWeight: 500
          }}>{action}</span>
        )}
        {toggle !== undefined && (
          <Toggle on={toggle} onChange={onToggle} />
        )}
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("설정");
  const [twoFactor, setTwoFactor] = useState(true);
  const [inviteAlarm, setInviteAlarm] = useState(true);
  const [voteAlarm, setVoteAlarm] = useState(false);
  const [scheduleAlarm, setScheduleAlarm] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useUser();
  const handleNavClick = (label) => {
    setActiveNav(label);
    setSidebarOpen(false);
    if (label === "참여 기록") { navigate("/history"); return; }
    if (label === "새 모임") { navigate("/newplan"); return; }
    if (label === "내 일정") { navigate("/mycalendar"); return; }
    if (label === "마이페이지") { navigate("/mypage"); return; }
  };

  return (
    <div className="page-fade" style={{
      display: "flex", height: "100vh", width: "100vw",
      background: "#111111", color: "#fff",
      fontFamily: "'Noto Sans KR', sans-serif",
      overflow: "hidden",
    }}>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="mobile-overlay" style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10, display: "none"
        }} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} style={{
        width: 180, background: "#111111",
        borderRight: "1px solid #2a2a2a",
        display: "flex", flexDirection: "column",
        padding: "24px 0", flexShrink: 0,
        transition: "transform 0.3s ease", zIndex: 20,
      }}>
        <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn" style={{
          display: "none", position: "absolute", top: 16, right: 12,
          background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer"
        }}>✕</button>

        <div onClick={() => navigate("/home")} style={{ padding: "0 20px 28px", fontSize: 20, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
  상대성 시간
</div>

        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <div key={item.label} onClick={() => handleNavClick(item.label)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 20px", cursor: "pointer",
              borderRadius: 8, margin: "2px 8px",
              background: activeNav === item.label ? "#222222" : "transparent",
              color: activeNav === item.label ? "#fff" : "#888",
              fontSize: 14, fontWeight: activeNav === item.label ? 600 : 400,
              transition: "background 0.15s",
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "11px 20px", color: "#fff", fontSize: 14, cursor: "pointer",
          background: "#222222", borderRadius: 8, margin: "2px 8px",
          borderTop: "1px solid #2a2a2a",
        }}>
          <span>⚙️</span> 설정
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderBottom: "1px solid #2a2a2a", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} className="hamburger-btn" style={{
              display: "none", background: "none", border: "none",
              color: "#fff", fontSize: 22, cursor: "pointer", padding: "0 4px"
            }}>☰</button>
            <span style={{ fontSize: 18, fontWeight: 700 }}>설정</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{
              background: "#3b6ef8", color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>🔗 공유하기</button>
            <span style={{ color: "#888", fontSize: 13 }}>ENG | KOR</span>
            <span style={{ color: "#888", fontSize: 16, cursor: "pointer" }}>ℹ️</span>
          </div>
        </div>

        {/* Settings content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          <Section title="계정">
            <Row label="이메일" value={user?.email || "이메일 없음"} last={false} />
            <Row label="비밀번호 변경" action="변경" last={false} />
            <Row label="2단계 인증" value={twoFactor ? "켜짐" : "꺼짐"}
              toggle={twoFactor} onToggle={setTwoFactor} last={true} />
          </Section>

          <Section title="연동">
            <Row label="Google" value={user?.email || "연결 안됨"} last={false} />
            <Row label="Apple" action="연결" last={true} />
          </Section>

          <Section title="보안">
            <Row label="로그인 기기 관리" action="관리" last={false} />
            <Row label="로그인 기록" action="보기" last={false} />
            <Row label="API 키" action="관리" last={true} />
          </Section>

          <Section title="알림">
            <Row label="초대 알림" toggle={inviteAlarm} onToggle={setInviteAlarm} last={false} />
            <Row label="투표 알림" toggle={voteAlarm} onToggle={setVoteAlarm} last={false} />
            <Row label="일정 확정 알림" toggle={scheduleAlarm} onToggle={setScheduleAlarm} last={true} />
          </Section>

          <Section title="환경">
            <Row label="언어" value="한국어" action="변경" last={false} />
            <Row label="시간 형식" value="12시간" action="변경" last={false} />
            <Row label="테마" value="다크" action="변경" last={true} />
          </Section>

          <button onClick={() => { logout(); navigate("/"); }} style={{
            width: "100%", background: "transparent", border: "1px solid #e84040",
            color: "#e84040", borderRadius: 10, padding: "14px 0",
            fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e84040"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#e84040"; }}
          >로그아웃</button>
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
          }
          .sidebar-open { transform: translateX(0%) !important; }
          .sidebar-close-btn { display: block !important; }
          .mobile-overlay { display: block !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}