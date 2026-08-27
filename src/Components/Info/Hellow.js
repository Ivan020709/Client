import React from 'react';

import './Hellow.css';
import { useNavigate } from 'react-router-dom';

function Hellow() {
    const navigate = useNavigate();
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
                    <div className="growth-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/SelectAi')}>
                        <span>💬</span>
                        <strong >대화</strong>
                        <small>"오늘 속상했던 일, 털어놓고 푹 자는 거 어때?"</small>
                    </div>

                    <div className="growth-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/Diary')}>
                        <span>📔</span>
                        <strong>감정 일기</strong>{/* 대화를 통한 경험치상승 비슷한 페이지로 이동 */}
                        <small>"나를 제일 잘 아는 방법, 하루 한 줄 감정일기로 시작해 봐."</small>
                    </div>

                    <div className="growth-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/Diary')}>
                        <span>📅</span>
                        <strong>캘린더</strong>
                        <small>"지나온 날들의 너의 기분을 한 눈에 확인 할 수 있어"</small>
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
