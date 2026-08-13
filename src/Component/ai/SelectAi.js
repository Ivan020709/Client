import React from 'react';
import '../../style/ai/SelectAi.css';
import ai1 from '../../Img/ai1.png';
import ai2 from '../../Img/ai2.png';
import ai3 from '../../Img/ai3.png';

function SelectAi() {
    return (
        <div className="select-ai">
            <div className="select-ai-container">
                <div className="ai-card">
                    <div className="ai-image-box">
                        <img src={ai1} alt="AI 1" className="ai-image" />
                    </div>
                    <div className="ai-info">
                        <h3>멍멍이</h3>
                        <p>편안하게 이야기를 들어주는 따뜻한 AI입니다.</p>
                    </div>
                </div>
                <div className="ai-card">
                    <div className="ai-image-box">
                        <img src={ai2} alt="AI 2" className="ai-image" />
                    </div>
                    <div className="ai-info">
                        <h3>별</h3>
                        <p>즐겁고 밝은 분위기로 대화할 수 있는 AI입니다.</p>
                    </div>
                </div>
                <div className="ai-card">
                    <div className="ai-image-box">
                        <img src={ai3} alt="AI 3" className="ai-image" />
                    </div>
                    <div className="ai-info">
                        <h3>달</h3>
                        <p>차분하게 고민을 나누고 함께 생각해주는 AI입니다.</p>
                    </div>
                </div>
            </div>
            <div>가나다라마바사</div>
        </div>
    );
}

export default SelectAi;