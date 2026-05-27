import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { usePlan } from "./PlanContext";

const NAV_ITEMS = [
  { label: "새 모임", icon: "+" },
  { label: "내 일정", icon: "📅" },
  { label: "참여 기록", icon: "🕐" },
  { label: "마이페이지", icon: "👤" },
];

const AVATARS = ["🧑", "👩", "👦", "👧", "🧔", "👱", "🧒", "👨", "👩‍🦰", "🧑‍🦱"];

export default function MyPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("마이페이지");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [addError, setAddError] = useState("");
  const { user } = useUser();
  const { userPlans } = usePlan();
  const createdCount = userPlans.filter(p => p.isMine).length;
  const joinedCount = userPlans.filter(p => !p.isMine).length;

  const handleDeleteClick = (id) => setDeleteTarget(id);

  const confirmDelete = () => {
    setFriends(prev => prev.filter(f => f.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const cancelDelete = () => setDeleteTarget(null);

  const handleAddFriend = () => {
    if (!addInput.trim()) {
      setAddError("이름, 아이디 또는 이메일을 입력해주세요.");
      return;
    }
    if (friends.some(f => f.email === addInput.trim() || f.name === addInput.trim())) {
      setAddError("이미 추가된 친구입니다.");
      return;
    }
    const newFriend = {
      id: Date.now(),
      name: addInput.trim(),
      email: addInput.includes("@") ? addInput.trim() : `${addInput.trim()}@gmail.com`,
      online: Math.random() > 0.5,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    };
    setFriends(prev => [...prev, newFriend]);
    setAddInput("");
    setAddError("");
    setShowAddModal(false);
  };

  const handleNavClick = (label) => {
    setActiveNav(label);
    setSidebarOpen(false);
    if (label === "참여 기록") { navigate("/history"); return; }
    if (label === "새 모임") { navigate("/newplan"); return; }
    if (label === "내 일정") { navigate("/mycalendar"); return; }
    if (label === "마이페이지") return;
  };

  return (
    <div className="page-fade" style={{
      display: "flex", height: "100vh", width: "100vw",
      background: "#111111", color: "#fff",
      fontFamily: "'Noto Sans KR', sans-serif",
      overflow: "hidden",
    }}>

      {/* 친구 삭제 모달 */}
      {deleteTarget && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={cancelDelete}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#1a1a1a", borderRadius: 14, padding: "28px",
            minWidth: 300, border: "1px solid #2a2a2a",
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>친구 삭제</p>
            <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>친구를 삭제하시겠습니까?</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={cancelDelete} style={{
                flex: 1, background: "#222222", border: "1px solid #2a2a2a",
                color: "#aaa", borderRadius: 8, padding: "12px 0",
                fontSize: 14, cursor: "pointer"
              }}>취소</button>
              <button onClick={confirmDelete} style={{
                flex: 1, background: "#e05555", border: "none",
                color: "#fff", borderRadius: 8, padding: "12px 0",
                fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 친구 추가 모달 */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={() => { setShowAddModal(false); setAddInput(""); setAddError(""); }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#1a1a1a", borderRadius: 14, padding: "28px",
            minWidth: 340, border: "1px solid #2a2a2a",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>친구 추가</p>
              <button onClick={() => { setShowAddModal(false); setAddInput(""); setAddError(""); }} style={{
                background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer"
              }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
              이름, 아이디 또는 이메일로 친구를 추가하세요.
            </p>
            <input
              value={addInput}
              onChange={e => { setAddInput(e.target.value); setAddError(""); }}
              onKeyDown={e => e.key === "Enter" && handleAddFriend()}
              placeholder="이름, 아이디 또는 이메일"
              autoFocus
              style={{
                width: "100%", background: "#222222", border: `1px solid ${addError ? "#e05555" : "#2a2a2a"}`,
                borderRadius: 8, padding: "12px 14px", fontSize: 14,
                color: "#fff", outline: "none", boxSizing: "border-box",
                fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 6,
              }}
            />
            {addError && (
              <p style={{ fontSize: 12, color: "#e05555", marginBottom: 12 }}>{addError}</p>
            )}
            {!addError && <div style={{ marginBottom: 12 }} />}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowAddModal(false); setAddInput(""); setAddError(""); }} style={{
                flex: 1, background: "#222222", border: "1px solid #2a2a2a",
                color: "#aaa", borderRadius: 8, padding: "12px 0",
                fontSize: 14, cursor: "pointer"
              }}>취소</button>
              <button onClick={handleAddFriend} style={{
                flex: 1, background: "#3b6ef8", border: "none",
                color: "#fff", borderRadius: 8, padding: "12px 0",
                fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>추가</button>
            </div>
          </div>
        </div>
      )}

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
        zIndex: 20, transition: "transform 0.3s ease",
      }}>
        <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn" style={{
          display: "none", position: "absolute", top: 16, right: 12,
          background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer"
        }}>✕</button>

        <div onClick={() => navigate("/home")} style={{
          padding: "0 20px 28px", fontSize: 20, fontWeight: 700, color: "#fff", cursor: "pointer"
        }}>
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

        <div onClick={() => navigate("/settings")} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "11px 20px", color: "#888", fontSize: 14, cursor: "pointer",
          transition: "color 0.15s", borderTop: "1px solid #2a2a2a",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "#888"}
        >
          <span>⚙️</span> 설정
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto",
        scrollbarWidth: "none", msOverflowStyle: "none" }}>

        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderBottom: "1px solid #2a2a2a",
          background: "#111111", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} className="hamburger-btn" style={{
              display: "none", background: "none", border: "none",
              color: "#fff", fontSize: 22, cursor: "pointer", padding: "0 4px"
            }}>☰</button>
            <span style={{ fontSize: 18, fontWeight: 700 }}>마이페이지</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{
              background: "#3b6ef8", color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}>🔗 공유하기</button>
            <span style={{ color: "#888", fontSize: 13 }}>ENG | KOR</span>
            <span style={{ color: "#888", fontSize: 16 }}>ℹ️</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 32px", maxWidth: 900 }}>

          {/* 프로필 카드 */}
          <div style={{
            background: "#1a1a1a", borderRadius: 14, padding: "24px",
            border: "1px solid #2a2a2a", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#3b6ef8", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 32,
              }}>👤</div>
              <div onClick={() => alert("프로필 사진 변경 준비 중!")} style={{
                position: "absolute", bottom: 0, right: 0,
                width: 24, height: 24, borderRadius: "50%",
                background: "#222222", border: "2px solid #111",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, cursor: "pointer",
              }}>✏️</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                {user?.name || "사용자"}
              </div>
              <div style={{ fontSize: 14, color: "#888" }}>
                {user?.email || "이메일 없음"}
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
            <div style={{
              flex: 1, background: "#1a1a1a", borderRadius: 12, padding: "20px 24px",
              border: "1px solid #2a2a2a",
            }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>📅 생성한 일정</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{createdCount}개</div>
            </div>
            <div style={{
              flex: 1, background: "#1a1a1a", borderRadius: 12, padding: "20px 24px",
              border: "1px solid #2a2a2a",
            }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>👥 참여한 일정</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{joinedCount}개</div>
            </div>
          </div>

          {/* 친구 목록 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                친구 목록 {friends.length > 0 && <span style={{ color: "#888", fontSize: 14, fontWeight: 400 }}>({friends.length})</span>}
              </span>
              <button onClick={() => setShowAddModal(true)} style={{
                background: "#3b6ef8", color: "#fff", border: "none",
                borderRadius: 8, padding: "7px 14px", fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                fontWeight: 600,
              }}>👥 친구 추가</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {friends.length === 0 && (
                <div style={{
                  gridColumn: "1 / -1", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", padding: "60px 0",
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 20,
                    background: "#222222", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 36, marginBottom: 20,
                  }}>👥</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                    아직 친구가 없습니다.
                  </div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
                    친구들을 추가하여 함께 일정을 만들어보세요.
                  </div>
                  <button onClick={() => setShowAddModal(true)} style={{
                    background: "#3b6ef8", color: "#fff", border: "none",
                    borderRadius: 8, padding: "10px 20px", fontSize: 14,
                    fontWeight: 600, cursor: "pointer",
                  }}>+ 친구 추가하기</button>
                </div>
              )}
              {friends.map(friend => (
                <div key={friend.id} style={{
                  background: "#1a1a1a", borderRadius: 12, padding: "14px 16px",
                  border: "1px solid #2a2a2a", position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#3a3a3a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                >
                  <button onClick={() => handleDeleteClick(friend.id)} style={{
                    position: "absolute", top: 8, right: 8,
                    background: "none", border: "none",
                    color: "#555", fontSize: 14, cursor: "pointer",
                    lineHeight: 1, padding: 2, transition: "color 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "#e05555"}
                    onMouseLeave={e => e.currentTarget.style.color = "#555"}
                  >✕</button>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "#222222", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 20,
                      }}>{friend.avatar || "👤"}</div>
                      <div style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: 10, height: 10, borderRadius: "50%",
                        background: friend.online ? "#4caf80" : "#555",
                        border: "2px solid #1a1a1a",
                      }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{friend.name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{friend.email}</div>
                    </div>
                  </div>

                  <button onClick={() => navigate("/newplan")} style={{
                    background: "#3b6ef8", color: "#fff", border: "none",
                    borderRadius: 8, padding: "7px 12px", fontSize: 12,
                    fontWeight: 600, cursor: "pointer", marginRight: 20,
                  }}>일정 만들기</button>
                </div>
              ))}
            </div>
          </div>
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