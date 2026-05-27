import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "새 모임", icon: "+" },
  { label: "내 일정", icon: "📅" },
  { label: "참여 기록", icon: "🕐" },
  { label: "마이페이지", icon: "👤" },
];

const HOURS = [
  "12 AM","1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM",
  "12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM"
];

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const LABELS = [
  { name: "학교", color: "#4285f4" },
  { name: "동아리", color: "#34a853" },
  { name: "과제", color: "#fbbc04" },
  { name: "알바", color: "#ff6d00" },
  { name: "스터디", color: "#ea4335" },
  { name: "스터디", color: "#9c27b0" },
];
const EVENT_COLORS = ["#4285f4", "#34a853", "#fbbc04", "#ff6d00", "#ea4335", "#9c27b0", "#00bcd4", "#ff4081", "#8bc34a", "#ff9800"];
let colorIndex = 0;

const CELL_HEIGHT = 60;

const INIT_EVENTS = [];

export default function MyCalendar() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("내 일정");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("주");
  const [weekOffset, setWeekOffset] = useState(0);
  const [events, setEvents] = useState(INIT_EVENTS);
  const [popup, setPopup] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const dragRef = useRef(null);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const month = startOfWeek.getMonth() + 1;
  const weekNum = Math.ceil(startOfWeek.getDate() / 7);

  const handleNavClick = (label) => {
    setActiveNav(label);
    setSidebarOpen(false);
    if (label === "새 모임") { navigate("/newplan"); return; }
    if (label === "내 일정") return;
    if (label === "참여 기록") { navigate("/history"); return; }
    if (label === "마이페이지") { navigate("/mypage"); return; }
  };

  const handleMouseDown = (di, hi, e) => {
    e.preventDefault();
    e.stopPropagation();
    const val = { day: di, startHour: hi, currentHour: hi, mouseX: e.clientX, mouseY: e.clientY };
    dragRef.current = val;
    setDragging({ ...val });
  };

  const handleMouseEnter = (di, hi) => {
    if (!dragRef.current || dragRef.current.day !== di) return;
    dragRef.current.currentHour = hi;
    setDragging(prev => prev ? { ...prev, currentHour: hi } : null);
  };

  const handleMouseUp = (di, hi, e) => {
    e.stopPropagation();
    const d = { ...(dragRef.current || { day: di, startHour: hi, currentHour: hi }) };

    // 단순 클릭이면 무시
    if (d.startHour === d.currentHour) {
      dragRef.current = null;
      setDragging(null);
      return;
    }

    dragRef.current = null;
    setDragging(null);

    const start = Math.min(d.startHour, d.currentHour);
    const end = Math.max(d.startHour, d.currentHour) + 1;
    const dayObj = weekDays[di];
    const dateStr = `${dayObj.getFullYear()}. ${String(dayObj.getMonth()+1).padStart(2,'0')}. ${String(dayObj.getDate()).padStart(2,'0')}`;
    const mx = d.mouseX || e.clientX;
    const my = d.mouseY || e.clientY;
    const popupW = 300, popupH = 320;
    const posX = mx + popupW + 16 > window.innerWidth ? mx - popupW - 8 : mx + 8;
    const posY = my + popupH > window.innerHeight ? window.innerHeight - popupH - 16 : my;

    setSelectedRange({ day: di, start, end });
    setTimeout(() => {
      setPopup({ day: di, startHour: start, endHour: end, title: "", color: "#4285f4", memo: "", link: "", dateStr, posX, posY });
      setShowColorPicker(false);
    }, 0);
  };

  const closePopup = () => {
    setPopup(null);
    setSelectedRange(null);
    setShowColorPicker(false);
  };

  const handleAddEvent = () => {
    if (!popup.title.trim()) return;
    const autoColor = EVENT_COLORS[colorIndex % EVENT_COLORS.length];
    colorIndex++;
    const eventDate = weekDays[popup.day];
    setEvents(prev => [...prev, {
      id: Date.now(),
      day: popup.day,
      date: eventDate.toDateString(),
      startHour: popup.startHour,
      endHour: popup.endHour,
      title: popup.title,
      color: popup.color !== "#4285f4" ? popup.color : autoColor,
      memo: popup.memo,
      link: popup.link,
    }]);
    setPopup(null);
    setSelectedRange(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDetailModal(null);
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

        <nav>
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

        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 10, fontWeight: 600 }}>라벨</div>
          {LABELS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                background: label.color, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#fff", flexShrink: 0,
              }}>✓</div>
              <span style={{ fontSize: 13, color: "#ccc" }}>{label.name}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ borderBottom: "1px solid #2a2a2a", background: "#111111", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setSidebarOpen(true)} className="hamburger-btn" style={{
                display: "none", background: "none", border: "none",
                color: "#fff", fontSize: 22, cursor: "pointer", padding: "0 4px"
              }}>☰</button>
              <button onClick={() => setWeekOffset(prev => prev - 1)} style={{
                background: "none", border: "none", color: "#888",
                fontSize: 16, cursor: "pointer", padding: "4px 6px",
              }}>◀</button>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{month}월 {weekNum}주차</span>
              <button onClick={() => setWeekOffset(prev => prev + 1)} style={{
                background: "none", border: "none", color: "#888",
                fontSize: 16, cursor: "pointer", padding: "4px 6px",
              }}>▶</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{
                background: "#3b6ef8", color: "#fff", border: "none",
                borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>🔗 공유하기</button>
              <span style={{ color: "#888", fontSize: 12 }}>ENG | KOR</span>
              <span style={{ color: "#888", fontSize: 15 }}>ℹ️</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px 10px", gap: 6 }}>
            <button onClick={() => setWeekOffset(0)} style={{
              background: "#222222", border: "1px solid #2a2a2a",
              color: "#fff", borderRadius: 8, padding: "5px 12px",
              fontSize: 12, cursor: "pointer",
            }}>오늘</button>
            {["일", "주", "월", "년"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? "#3b6ef8" : "#222222",
                border: "1px solid #2a2a2a",
                color: view === v ? "#fff" : "#aaa",
                borderRadius: 8, padding: "5px 12px",
                fontSize: 12, cursor: "pointer",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* 캘린더 */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", userSelect: "none" }}
          onClick={() => { closePopup(); }}
          onMouseUp={() => { setDragging(null); }}
        >
          {/* 요일 헤더 */}
          <div style={{
            display: "flex", position: "sticky", top: 0,
            background: "#111111", zIndex: 5,
            borderBottom: "1px solid #2a2a2a",
          }}>
            <div style={{ width: 80, flexShrink: 0 }} />
            {weekDays.map((day, di) => {
              const isToday = day.toDateString() === today.toDateString();
              return (
                <div key={di} style={{
                  flex: 1, height: 48,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  borderLeft: "1px solid #2a2a2a",
                }}>
                  <span style={{ fontSize: 11, color: isToday ? "#3b6ef8" : "#888", fontWeight: isToday ? 700 : 400 }}>
                    {DAYS_OF_WEEK[day.getDay()]}
                  </span>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: isToday ? "#3b6ef8" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isToday ? "#fff" : "#888",
                    fontSize: 13, fontWeight: isToday ? 700 : 400, marginTop: 2,
                  }}>{day.getDate()}</span>
                </div>
              );
            })}
          </div>

          {/* 시간 + 셀 */}
          <div style={{ display: "flex" }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              {HOURS.map((h, i) => (
                <div key={i} style={{
                  height: CELL_HEIGHT, display: "flex", alignItems: "flex-start",
                  justifyContent: "flex-end", paddingRight: 10, paddingTop: 4,
                  color: "#555", fontSize: 11,
                }}>{h}</div>
              ))}
            </div>

            {weekDays.map((day, di) => (
              <div key={di} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ position: "relative" }}>
                  {HOURS.map((_, hi) => {
                    const isDragActive = dragging && dragging.day === di &&
                      hi >= Math.min(dragging.startHour, dragging.currentHour) &&
                      hi <= Math.max(dragging.startHour, dragging.currentHour);
                    const isSelected = selectedRange && selectedRange.day === di &&
                      hi >= selectedRange.start && hi < selectedRange.end;
                    return (
                      <div key={hi}
                        onMouseDown={e => handleMouseDown(di, hi, e)}
                        onMouseEnter={() => handleMouseEnter(di, hi)}
                        onMouseUp={e => handleMouseUp(di, hi, e)}
                        onDoubleClick={e => {
                          e.stopPropagation();
                          const dayObj = weekDays[di];
                          const dateStr = `${dayObj.getFullYear()}. ${String(dayObj.getMonth()+1).padStart(2,'0')}. ${String(dayObj.getDate()).padStart(2,'0')}`;
                          const posX = e.clientX + 316 > window.innerWidth ? e.clientX - 308 : e.clientX + 8;
                          const posY = e.clientY + 320 > window.innerHeight ? window.innerHeight - 336 : e.clientY;
                          setSelectedRange({ day: di, start: hi, end: hi + 1 });
                          setPopup({ day: di, startHour: hi, endHour: hi + 1, title: "", color: "#4285f4", memo: "", link: "", dateStr, posX, posY });
                          setShowColorPicker(false);
                        }}
                        style={{
                          height: CELL_HEIGHT,
                          borderBottom: "1px solid #1e1e1e",
                          borderLeft: "1px solid #2a2a2a",
                          cursor: "crosshair",
                          background: isDragActive
                            ? "rgba(59,110,248,0.25)"
                            : isSelected
                              ? "rgba(59,110,248,0.15)"
                              : "transparent",
                          transition: "background 0.05s",
                        }}
                      />
                    );
                  })}

                  {events.filter(ev => ev.date === weekDays[di].toDateString()).map(ev => (
                    <div key={ev.id} onClick={e => { e.stopPropagation(); setDetailModal(ev); closePopup(); }} style={{
                      position: "absolute",
                      top: ev.startHour * CELL_HEIGHT + 2,
                      left: 2, right: 2,
                      height: (ev.endHour - ev.startHour) * CELL_HEIGHT - 4,
                      background: `${ev.color}33`,
                      borderRadius: 4, padding: "4px 6px",
                      fontSize: 11, fontWeight: 600,
                      cursor: "pointer", overflow: "hidden",
                      transition: "filter 0.15s",
                      borderLeft: `3px solid ${ev.color}`,
                    }}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.3)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                    >
                      <div style={{ color: ev.color }}>{ev.title}</div>
                      <div style={{ fontSize: 10, color: "#aaa" }}>
                        {HOURS[ev.startHour]} - {HOURS[ev.endHour]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 팝업 */}
      {popup && (
        <div onClick={e => e.stopPropagation()} style={{
          position: "fixed",
          top: popup.posY ?? "50%",
          left: popup.posX ?? "50%",
          transform: popup.posX ? "none" : "translate(-50%, -50%)",
          width: 300,
          background: "#2a2a2a",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          zIndex: 200,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px 0",
          }}>
            <span style={{ fontSize: 12, color: "#aaa" }}>비공개 🔒</span>
            <button onClick={closePopup} style={{
              background: "none", border: "none", color: "#888", fontSize: 18, cursor: "pointer"
            }}>✕</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}>
            <input
              value={popup.title}
              onChange={e => setPopup(prev => ({ ...prev, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleAddEvent()}
              placeholder="새 일정"
              autoFocus
              style={{
                flex: 1, background: "#3a3a3a", border: "none",
                borderBottom: "2px solid #3b6ef8",
                color: "#fff", padding: "6px 8px", fontSize: 15,
                outline: "none", borderRadius: "4px 4px 0 0",
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            />
            <div style={{ position: "relative" }}>
              <div onClick={() => setShowColorPicker(v => !v)} style={{
                width: 24, height: 24, borderRadius: "50%",
                background: popup.color, cursor: "pointer",
                border: "2px solid #555",
              }} />
              {showColorPicker && (
                <div style={{
                  position: "absolute", right: 0, top: 30,
                  background: "#333", borderRadius: 8,
                  padding: "8px", display: "flex", flexDirection: "column", gap: 4,
                  zIndex: 300, boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}>
                  {LABELS.map((l, i) => (
                    <div key={i} onClick={() => { setPopup(prev => ({ ...prev, color: l.color })); setShowColorPicker(false); }} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#444"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: l.color }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "4px 14px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "#888" }}>🕐</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>
              {popup.dateStr} {HOURS[popup.startHour]} - {HOURS[Math.min(popup.endHour, 23)]}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, padding: "0 14px 8px" }}>
            <select value={popup.startHour} onChange={e => setPopup(prev => ({ ...prev, startHour: +e.target.value }))} style={{
              flex: 1, background: "#3a3a3a", border: "1px solid #444",
              color: "#fff", borderRadius: 6, padding: "6px 8px", fontSize: 11, outline: "none",
            }}>
              {HOURS.map((h, i) => <option key={i} value={i}>{h}</option>)}
            </select>
            <span style={{ color: "#555", alignSelf: "center" }}>-</span>
            <select value={popup.endHour} onChange={e => setPopup(prev => ({ ...prev, endHour: +e.target.value }))} style={{
              flex: 1, background: "#3a3a3a", border: "1px solid #444",
              color: "#fff", borderRadius: 6, padding: "6px 8px", fontSize: 11, outline: "none",
            }}>
              {HOURS.map((h, i) => <option key={i} value={i}>{h}</option>)}
            </select>
          </div>

          <div style={{ padding: "0 14px 6px" }}>
            <input
              value={popup.link}
              onChange={e => setPopup(prev => ({ ...prev, link: e.target.value }))}
              placeholder="링크 추가"
              style={{
                width: "100%", background: "transparent", border: "none",
                borderBottom: "1px solid #444", color: "#aaa",
                padding: "6px 4px", fontSize: 13, outline: "none",
                boxSizing: "border-box", fontFamily: "'Noto Sans KR', sans-serif",
              }}
            />
          </div>

          <div style={{ padding: "0 14px 12px" }}>
            <input
              value={popup.memo}
              onChange={e => setPopup(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="메모 추가"
              style={{
                width: "100%", background: "transparent", border: "none",
                borderBottom: "1px solid #444", color: "#aaa",
                padding: "6px 4px", fontSize: 13, outline: "none",
                boxSizing: "border-box", fontFamily: "'Noto Sans KR', sans-serif",
              }}
            />
          </div>

          <div style={{ padding: "0 14px 14px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleAddEvent} style={{
              background: "#3b6ef8", border: "none", color: "#fff",
              borderRadius: 8, padding: "8px 20px", fontSize: 13,
              fontWeight: 700, cursor: "pointer",
            }}>저장</button>
          </div>
        </div>
      )}

      {/* 일정 상세 모달 */}
      {detailModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={() => setDetailModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#1a1a1a", borderRadius: 14, padding: "28px",
            minWidth: 300, border: "1px solid #2a2a2a",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: detailModal.color }} />
                <span style={{ fontSize: 16, fontWeight: 700 }}>{detailModal.title}</span>
              </div>
              <button onClick={() => setDetailModal(null)} style={{
                background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer"
              }}>✕</button>
            </div>
            <p style={{ color: "#aaa", fontSize: 14, marginBottom: 8 }}>
              🕐 {HOURS[detailModal.startHour]} - {HOURS[detailModal.endHour]}
            </p>
            {detailModal.link && <p style={{ color: "#3b6ef8", fontSize: 13, marginBottom: 8 }}>🔗 {detailModal.link}</p>}
            {detailModal.memo && <p style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>📝 {detailModal.memo}</p>}
            <button onClick={() => handleDeleteEvent(detailModal.id)} style={{
              width: "100%", background: "#e05555", border: "none",
              color: "#fff", borderRadius: 8, padding: "12px 0",
              fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8,
            }}>일정 삭제</button>
          </div>
        </div>
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
        select option { background: #333; }
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; top: 0; left: 0; bottom: 0; transform: translateX(-100%); }
          .sidebar-open { transform: translateX(0%) !important; }
          .sidebar-close-btn { display: block !important; }
          .mobile-overlay { display: block !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}