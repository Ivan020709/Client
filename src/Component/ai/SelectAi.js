import React, { useEffect, useState } from 'react';
import '../../style/ai/SelectAi.css';

import ai1 from '../../Img/ai1.png';
import ai2 from '../../Img/ai2.png';
import ai3 from '../../Img/ai3.png';


function SelectAi() {

    // 선택된 카테고리
    const [selectedCategory, setSelectedCategory] = useState(null);


    // 카테고리 목록
    const categories = [
        {
            id: 1,
            name: '연애',
            icon: '❤️'
        },
        {
            id: 2,
            name: '학교/학업',
            icon: '📚'
        },
        {
            id: 3,
            name: '진로/취업',
            icon: '🎯'
        },
        {
            id: 4,
            name: '친구/대인관계',
            icon: '🧑‍🤝‍🧑'
        },
        {
            id: 5,
            name: '직장',
            icon: '💼'
        },
        {
            id: 6,
            name: '돈/경제',
            icon: '💰'
        },
        {
            id: 7,
            name: '감정/기분',
            icon: '💭'
        },
        {
            id: 8,
            name: '스트레스',
            icon: '😣'
        },
        {
            id: 9,
            name: '자존감/자기이해',
            icon: '🌱'
        }
    ];

    // 카테고리 선택
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };
    // 대화 시작
    const handleStartChat = () => {
        if (!selectedCategory) {
            alert('상담 카테고리를 선택해주세요.');
            return;
        }


        console.log('선택한 카테고리:', selectedCategory);
        // 나중에 여기서 상담 페이지로 이동
        // navigate('/chat');


        alert(
            `${selectedCategory.icon} ${selectedCategory.name} 상담을 시작합니다.`
        );
    };
    return (
        <div className="select-ai">
            {/* =================================
                AI 선택 영역
            ================================= */}
            <div className="select-ai-container">
                {/* AI 1 */}
                <div className="ai-card">
                    <div className="ai-image-box">
                        <img src={ai1} alt="AI 1" className="ai-image"/>
                    </div>
                    <div className="ai-info">
                        <h3>멍멍이</h3>
                        <p>편안하게 이야기를 들어주는 따뜻한 AI입니다.</p>
                    </div>
                    <div className="ai-example">
                        <div className="example-user">
                            나 오늘 너무 힘들었어...
                        </div>
                        <div className="example-ai">
                            무슨 일이 있었어? 괜찮아.
                            천천히 이야기해도 괜찮아.
                        </div>
                    </div>
                </div>
                {/* AI 2 */}
                <div className="ai-card">
                    <div className="ai-image-box">
                        <img src={ai2} alt="AI 2"className="ai-image"/>
                    </div>
                    <div className="ai-info">
                        <h3>별</h3>
                        <p>
                            즐겁고 밝은 분위기로
                            대화할 수 있는 AI입니다.
                        </p>
                    </div>
                    <div className="ai-example">
                        <div className="example-user">오늘 재미있는 일이 있었어!</div>
                        <div className="example-ai">
                            정말? 무슨 일이었는데?
                            나한테도 이야기해줘!
                        </div>
                    </div>
                </div>
                {/* AI 3 */}
                <div className="ai-card">
                    <div className="ai-image-box">
                        <img src={ai3}alt="AI 3"className="ai-image"/>
                    </div>
                    <div className="ai-info">
                        <h3>달</h3>
                        <p>
                            차분하게 고민을 나누고
                            함께 생각해주는 AI입니다.
                        </p>
                    </div>
                    <div className="ai-example">
                        <div className="example-user">
                            요즘 고민이 하나 있어.
                        </div>
                        <div className="example-ai">
                            괜찮아.
                            서두르지 말고 천천히 이야기해봐.
                        </div>
                    </div>
                </div>
            </div>
            {/* =================================
                카테고리 영역
            ================================= */}
            <div className="ai-extra-area">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={
                            selectedCategory?.id === category.id
                                ? 'category selected'
                                : 'category'
                        }
                        onClick={() =>
                            handleCategoryClick(category)
                        }
                    >
                        {category.icon} {category.name}
                    </div>
                ))}
            </div>
            {/* =================================
                선택된 카테고리 표시
            ================================= */}
            <div className="selected-category">
                {selectedCategory ? (
                    <p>
                        <strong>
                            {selectedCategory.icon}
                            {' '}
                            {selectedCategory.name}
                        </strong>
                        {' '}상담을 선택했습니다.
                    </p>
                ) : (
                    <p>
                        상담하고 싶은 카테고리를 선택해주세요.
                    </p>
                )}
            </div>
            {/* =================================
                대화 시작 버튼
            ================================= */}
            <div className="SelectAi_btn">
                <button onClick={handleStartChat}>💬 대화 시작하기</button>
            </div>
        </div>
    );
}


export default SelectAi;