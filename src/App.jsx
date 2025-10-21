import { useState } from "react";
import { Smartphone, Mail, CheckCircle2, Loader2, Copy, Check } from "lucide-react";
import './App.css'; // App.css import (선택사항, Vite 기본)

export default function App() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 랜덤 문자열 생성 함수
  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // 1단계: 인증 코드 생성 및 전송
  const handleGenerateCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("올바른 전화번호를 입력해주세요");
      return;
    }

    setIsLoading(true);
    const code = generateRandomCode();
    setVerificationCode(code);

    // 실제로는 여기서 SMS 전송 API를 호출합니다
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  // 2단계: 코드 복사
  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 3단계: 이메일 확인 대기
  const handleWaitingForEmail = () => {
    setIsLoading(true);
    // 실제로는 여기서 이메일 확인 폴링을 시작합니다
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1000);
  };
  
  // 4단계: 인증 완료 시뮬레이션
  const handleVerifyEmail = () => {
    setIsLoading(true);

    // 실제로는 여기서 서버에 이메일 확인을 요청합니다
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 2000);
  };


  // 처음부터 다시 시작
  const handleReset = () => {
    setStep(1);
    setPhoneNumber("");
    setVerificationCode("");
    setIsLoading(false);
    setCopied(false);
  };

  return (
    <div className="container">
      <div className="w-full max-w-2xl">
        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold`}
                  style={{
                    backgroundColor: step >= num ? 'var(--primary)' : 'var(--muted)',
                    color: step >= num ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
                  }}
                >
                  {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded`} 
                    style={{ backgroundColor: step > num ? 'var(--primary)' : 'var(--muted)' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>전화번호</span>
            <span>코드생성</span>
            <span>이메일확인</span>
            <span>완료</span>
          </div>
        </div>

        {/* Step 1: 전화번호 입력 */}
        {step === 1 && (
          <div className="card">
            <div className="card-header">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <h1 className="card-title">전화번호 인증</h1>
              <p className="card-description">인증을 시작하려면 전화번호를 입력해주세요</p>
            </div>
            <div className="card-content space-y-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  전화번호
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input h-12 text-lg"
                />
              </div>
              <button onClick={handleGenerateCode} disabled={isLoading} className="button button-primary w-full h-12 text-lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    처리중...
                  </>
                ) : (
                  "인증 코드 생성"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 인증 코드 표시 */}
        {step === 2 && (
          <div className="card">
            <div className="card-header">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <h1 className="card-title">인증 코드 생성 완료</h1>
              <p className="card-description">아래 코드를 SMS로 전송해주세요</p>
            </div>
            <div className="card-content space-y-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">인증 코드</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-4xl font-mono font-bold tracking-wider text-primary">{verificationCode}</code>
                  <button onClick={handleCopyCode} className="button button-outline button-icon">
                    {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                {copied && <p className="text-sm text-success mt-2">복사되었습니다!</p>}
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">📱 SMS 전송 방법</p>
                <ol className="text-sm text-muted-foreground space-y-1" style={{ listStylePosition: 'inside', listStyleType: 'decimal' }}>
                  <li>위 코드를 복사하세요</li>
                  <li>SMS 앱을 열어 {phoneNumber}로 전송하세요</li>
                  <li>전송 후 아래 버튼을 클릭하세요</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset} className="button button-outline flex-1">
                  처음부터
                </button>
                <button onClick={handleWaitingForEmail} className="button button-primary flex-1">
                  SMS 전송 완료
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: 이메일 확인 대기 */}
        {step === 3 && (
          <div className="card">
            <div className="card-header">
               <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <h1 className="card-title">이메일 확인 중</h1>
              <p className="card-description">운영팀 이메일에서 인증 코드를 확인하고 있습니다</p>
            </div>
            <div className="card-content space-y-6">
              <div className="bg-muted rounded-lg p-6 text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">전송된 코드</p>
                  <code className="text-2xl font-mono font-bold tracking-wider text-primary">{verificationCode}</code>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">✉️ 확인 프로세스</p>
                 <ul className="text-sm text-muted-foreground space-y-1" style={{ listStylePosition: 'inside' }}>
                  <li>SMS가 이메일로 전달되었습니다</li>
                  <li>서버가 이메일 내용을 확인하고 있습니다</li>
                  <li>코드가 일치하면 자동으로 인증됩니다</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset} className="button button-outline flex-1">
                  취소
                </button>
                <button onClick={handleVerifyEmail} disabled={isLoading} className="button button-primary flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      확인중...
                    </>
                  ) : (
                    "수동 확인"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: 인증 완료 */}
        {step === 4 && (
          <div className="card border-success">
            <div className="card-header">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h1 className="card-title text-success">인증 완료!</h1>
              <p className="card-description">전화번호 인증이 성공적으로 완료되었습니다</p>
            </div>
            <div className="card-content space-y-6">
              <div className="bg-success/10 rounded-lg p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">전화번호</span>
                  <span className="font-mono font-semibold">{phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">인증 코드</span>
                  <span className="font-mono font-semibold">{verificationCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">상태</span>
                  <span className="badge badge-success">인증 완료</span>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground text-center">
                  이제 인증된 전화번호로 서비스를 이용하실 수 있습니다
                </p>
              </div>

              <button onClick={handleReset} className="button button-outline w-full">
                새로운 인증 시작
              </button>
            </div>
          </div>
        )}

        {/* 하단 정보 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>SMS → Email 게이트웨이 인증 시스템</p>
          <p className="mt-1">UI/UX 데모 버전</p>
        </div>
      </div>
    </div>
  );
}