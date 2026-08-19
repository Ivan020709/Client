import React from 'react';
import './Hellow.css';

function Hellow() {
    return (
        <div className="hello-page">
            <div className="hello-container">
                <div className="hello-icon">💬</div>

                <h2>오늘, 누구와 이야기하고 싶나요?</h2>

                <p className="hello-main">
                    특별한 이야기가 아니어도 괜찮아요.<br />
                    오늘 있었던 작은 일부터, 아무에게도 말하지 못했던 이야기까지.<br />
                    여기서는 부담 없이 이야기해주세요.
                </p>

                <div className="hello-divider"></div>

                <p>
                    AI와 대화하며 하루를 돌아보고,<br />
                    감정을 기록하고, 나만의 AI를 조금씩 성장시켜보세요. 🌱
                </p>

                <div className="hello-growth">
                    <div className="growth-item">
                        <span>💬</span>
                        <strong style={{ cursor: 'pointer' }}>대화</strong>
                        <small>AI와 편하게 이야기하기</small>
                    </div>

                    <div className="growth-item">
                        <span>🌱</span>
                        <strong>성장</strong>{/* 대화를 통한 경험치상승 비슷한 페이지로 이동 */}
                        <small>대화를 통해 경험치 쌓기</small>
                    </div>

                    <div className="growth-item">
                        <span>✨</span>
                        <strong>랭킹</strong>{/* 랭킹 페이지로 이동 */}
                        <small>나만의 AI 랭킹확인하기</small>
                    </div>
                </div>

                <p className="hello-highlight">
                    <strong>당신의 AI는 당신과 함께 성장합니다.</strong>
                </p>

                <p className="hello-bottom">
                    오늘도 편하게 들러주세요.<br />
                    잠깐의 대화가 생각보다 큰 위로가 될 수도 있으니까요. ☁️
                </p>
            </div>
        </div>
    );
}

export default Hellow;
