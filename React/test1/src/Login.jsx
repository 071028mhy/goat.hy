import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const STEPS = ["방식 선택", "약관 동의", "정보 입력", "프로필 설정", "가입 완료"];

function Register({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { register } = useUser();

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", marginBottom: 28 }}>
              원하는 방식으로 계정을 만들어 보세요.
            </p>
            <button onClick={() => setStep(2)} style={{
              width: "100%", background: "#4f8ef7", color: "#fff",
              border: "none", borderRadius: 10, padding: "15px 0",
              fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 20,
            }}>이메일로 가입하기</button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#2e2e2e" }} />
              <span style={{ color: "#555", fontSize: 13 }}>또는</span>
              <div style={{ flex: 1, height: 1, background: "#2e2e2e" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
              {[
                { title: "카카오", bg: "#FEE500", svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3C6.582 3 3 5.91 3 9.5c0 2.282 1.523 4.284 3.832 5.427l-.977 3.632a.25.25 0 0 0 .373.28L10.63 16.4A10.1 10.1 0 0 0 11 16.4c4.418 0 8-2.91 8-6.5S15.418 3 11 3Z" fill="#1A1A1A"/></svg> },
                { title: "페이스북", bg: "#1877F2", svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M12.5 11.5h2l.5-2.5h-2.5V7.5c0-.7.2-1.5 1.5-1.5H15V3.5S13.8 3 12.7 3C10.1 3 8.5 4.5 8.5 7.3V9H6.5v2.5H8.5V19h3v-7.5h1.5l-.5.5Z" fill="white"/></svg> },
                { title: "구글", bg: "#ffffff", svg: <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.09 29.48 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 3.48C12.4 12.27 17.73 9.5 24 9.5z"/><path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.48-4.67 7.17l7.18 3.52C43.1 36.06 46.52 30.73 46.52 24.5z"/><path fill="#FBBC05" d="M10.74 28.3A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.74-4.3l-7.1-3.48A23.93 23.93 0 0 0 0 24c0 3.86.92 7.5 2.56 10.72l8.18-6.42z"/><path fill="#34A853" d="M24 47c5.48 0 10.08-1.81 13.44-4.92l-7.18-3.52c-1.8 1.21-4.1 1.94-6.26 1.94-6.27 0-11.6-2.77-13.26-8.2l-8.18 6.42C7.07 41.52 14.82 47 24 47z"/></svg> },
                { title: "네이버", bg: "#03C75A", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="white"/></svg> },
                { title: "애플", bg: "#1c1c1e", svg: <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M14.8 10.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.7ZM12.5 3.6c.6-.7 1-1.7.9-2.6-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.2Z" fill="white"/></svg> },
              ].map(({ title, bg, svg }) => (
                <button key={title} onClick={() => setStep(2)} style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: bg, border: title === "애플" ? "1px solid #3a3a3a" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>{svg}</button>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#888" }}>
              이미 계정이 있나요?{" "}
              <span onClick={onBack} style={{ color: "#4f8ef7", cursor: "pointer" }}>로그인</span>
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>서비스 이용약관</p>
            <div style={{
              background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: 10,
              padding: 16, height: 160, overflowY: "auto", fontSize: 12,
              color: "#888", marginBottom: 16, lineHeight: 1.7,
            }}>
              제1조 (목적) 본 약관은 상대성 시간 서비스 이용에 관한 조건 및 절차를 규정합니다.<br/>
              제2조 (이용자 의무) 이용자는 관련 법령 및 본 약관의 규정을 준수해야 합니다.<br/>
              제3조 (개인정보 보호) 서비스는 개인정보 보호법에 따라 이용자의 정보를 보호합니다.<br/>
              제4조 (서비스 이용) 서비스는 일정 조율 및 관련 기능을 제공합니다.<br/>
              제5조 (면책조항) 천재지변 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 24 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }} />
              <span style={{ color: "#ccc", fontSize: 14 }}>약관에 동의합니다</span>
            </label>
            <button onClick={() => agreed && setStep(3)} style={{
              width: "100%", background: agreed ? "#4f8ef7" : "#2a2a2a",
              color: agreed ? "#fff" : "#555", border: "none",
              borderRadius: 10, padding: "15px 0", fontSize: 15,
              fontWeight: 600, cursor: agreed ? "pointer" : "default",
            }}>다음</button>
          </div>
        );
      case 3:
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>이메일</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요" type="email"
                style={{
                  width: "100%", background: "#1c1c1c", border: "1px solid #2e2e2e",
                  borderRadius: 10, padding: "13px 16px", fontSize: 14,
                  color: "#fff", outline: "none", boxSizing: "border-box",
                }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>비밀번호</label>
              <input value={password} onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요" type="password"
                style={{
                  width: "100%", background: "#1c1c1c", border: "1px solid #2e2e2e",
                  borderRadius: 10, padding: "13px 16px", fontSize: 14,
                  color: "#fff", outline: "none", boxSizing: "border-box",
                }} />
            </div>
            <button onClick={() => { if(email && password) setStep(4); }} style={{
              width: "100%", background: "#4f8ef7", color: "#fff",
              border: "none", borderRadius: 10, padding: "15px 0",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>다음</button>
          </div>
        );
      case 4:
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "#2a2a2a", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 36, cursor: "pointer", border: "2px dashed #444",
              }}>👤</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>닉네임</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="닉네임을 입력하세요"
                style={{
                  width: "100%", background: "#1c1c1c", border: "1px solid #2e2e2e",
                  borderRadius: 10, padding: "13px 16px", fontSize: 14,
                  color: "#fff", outline: "none", boxSizing: "border-box",
                }} />
            </div>
            <button onClick={() => { if(name) setStep(5); }} style={{
              width: "100%", background: "#4f8ef7", color: "#fff",
              border: "none", borderRadius: 10, padding: "15px 0",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>다음</button>
          </div>
        );
      case 5:
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>가입 완료!</p>
            <p style={{ color: "#aaa", fontSize: 14, marginBottom: 32 }}>
              상대성 시간에 오신 걸 환영해요, {name}님!
            </p>
            <button onClick={() => {
              register(name, email);
              navigate('/home');
            }} style={{
              width: "100%", background: "#4f8ef7", color: "#fff",
              border: "none", borderRadius: 10, padding: "15px 0",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>시작하기</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{
      height: "100vh", background: "#111111",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 480, padding: "48px 40px 40px" }}>
        <h1 style={{
          fontSize: "2rem", fontWeight: 700, textAlign: "center",
          marginBottom: 28, color: "#fff",
        }}>상대성 시간</h1>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 0, marginBottom: 32 }}>
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isActive = num === step;
            const isDone = num < step;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: isDone ? "#4f8ef7" : "#2e2e2e" }} />}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isActive ? "#4f8ef7" : isDone ? "#4f8ef7" : "#2a2a2a",
                    color: isActive || isDone ? "#fff" : "#555",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{isDone ? "✓" : num}</div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: isDone ? "#4f8ef7" : "#2e2e2e" }} />}
                </div>
                <span style={{ fontSize: 11, color: isActive ? "#fff" : "#555", marginTop: 6, fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>
          {step === 1 ? "회원가입" : step === 2 ? "약관 동의" : step === 3 ? "정보 입력" : step === 4 ? "프로필 설정" : "가입 완료"}
        </p>

        {renderStep()}
      </div>
    </div>
  );
}

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useUser();

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  const handleLogin = () => {
    const id = userId.trim();
    const pw = password.trim();
    if (!id || !pw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    login(id, pw);
    navigate('/home');
  };

  const handleUserIdKeyDown = (e) => {
    if (e.key === 'Enter') passwordRef.current.focus();
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const handleSocialLogin = (title) => {
    alert(title + ' 로그인을 시도합니다.');
  };

  return (
    <div style={{
      height: "100vh", background: "#111111",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        padding: "48px 40px 40px",
        animation: "fadeUp 0.5s ease both",
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <h1 style={{
          fontSize: "2rem", fontWeight: 700, textAlign: "center",
          marginBottom: 40, letterSpacing: "-0.5px", color: "#ffffff"
        }}>상대성 시간</h1>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#ffffff", marginBottom: 8 }}>아이디</label>
          <input
            type="text" placeholder="아이디를 입력하세요"
            value={userId} onChange={(e) => setUserId(e.target.value)}
            onKeyDown={handleUserIdKeyDown}
            style={{
              width: "100%", background: "#1c1c1c",
              border: "1px solid #2e2e2e", borderRadius: 10,
              padding: "15px 18px", fontSize: "0.92rem",
              color: "#ffffff", outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#ffffff", marginBottom: 8 }}>비밀번호</label>
          <input
            ref={passwordRef} type="password" placeholder="비밀번호를 입력하세요"
            value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handlePasswordKeyDown}
            style={{
              width: "100%", background: "#1c1c1c",
              border: "1px solid #2e2e2e", borderRadius: 10,
              padding: "15px 18px", fontSize: "0.92rem",
              color: "#ffffff", outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button onClick={handleLogin} style={{
            flex: 1, padding: "15px 0", borderRadius: 10,
            fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
            border: "none", background: "#4f8ef7", color: "#fff",
            fontFamily: "inherit",
          }}>로그인</button>
          <button onClick={() => setShowRegister(true)} style={{
            flex: 1, padding: "15px 0", borderRadius: 10,
            fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
            background: "transparent", color: "#ffffff",
            border: "1px solid #3a3a3a", fontFamily: "inherit",
          }}>회원가입</button>
        </div>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", marginTop: 20
        }}>
          <a href="#" style={{ color: "#aaaaaa", fontSize: "0.82rem", textDecoration: "none", padding: "0 14px" }}>아이디 찾기</a>
          <span style={{ color: "#3a3a3a", fontSize: "0.82rem" }}>|</span>
          <a href="#" style={{ color: "#aaaaaa", fontSize: "0.82rem", textDecoration: "none", padding: "0 14px" }}>비밀번호 찾기</a>
        </div>

        <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 14 }}>
          {[
            { title: "카카오", bg: "#FEE500", svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3C6.582 3 3 5.91 3 9.5c0 2.282 1.523 4.284 3.832 5.427l-.977 3.632a.25.25 0 0 0 .373.28L10.63 16.4A10.1 10.1 0 0 0 11 16.4c4.418 0 8-2.91 8-6.5S15.418 3 11 3Z" fill="#1A1A1A"/></svg> },
            { title: "페이스북", bg: "#1877F2", svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M12.5 11.5h2l.5-2.5h-2.5V7.5c0-.7.2-1.5 1.5-1.5H15V3.5S13.8 3 12.7 3C10.1 3 8.5 4.5 8.5 7.3V9H6.5v2.5H8.5V19h3v-7.5h1.5l-.5.5Z" fill="white"/></svg> },
            { title: "구글", bg: "#ffffff", svg: <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.09 29.48 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 3.48C12.4 12.27 17.73 9.5 24 9.5z"/><path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.48-4.67 7.17l7.18 3.52C43.1 36.06 46.52 30.73 46.52 24.5z"/><path fill="#FBBC05" d="M10.74 28.3A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.74-4.3l-7.1-3.48A23.93 23.93 0 0 0 0 24c0 3.86.92 7.5 2.56 10.72l8.18-6.42z"/><path fill="#34A853" d="M24 47c5.48 0 10.08-1.81 13.44-4.92l-7.18-3.52c-1.8 1.21-4.1 1.94-6.26 1.94-6.27 0-11.6-2.77-13.26-8.2l-8.18 6.42C7.07 41.52 14.82 47 24 47z"/></svg> },
            { title: "네이버", bg: "#03C75A", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="white"/></svg> },
            { title: "애플", bg: "#1c1c1e", svg: <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M14.8 10.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.7ZM12.5 3.6c.6-.7 1-1.7.9-2.6-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.2Z" fill="white"/></svg> },
          ].map(({ title, bg, svg }) => (
            <button key={title} onClick={() => handleSocialLogin(title)} style={{
              width: 44, height: 44, borderRadius: "50%",
              background: bg, border: title === "애플" ? "1px solid #3a3a3a" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>{svg}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;