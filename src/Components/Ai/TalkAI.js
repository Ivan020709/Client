import React, { useState } from "react";
import axios from "axios";

import "./TalkAI.css";

function TalkAI() {

    // =====================================================
    // 상태
    // =====================================================

    const [character, setCharacter] = useState("필");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);


    // =====================================================
    // 캐릭터
    // =====================================================

    const characters = [
        {
            name: "필",
            description: "따뜻하고 공감해주는 AI",
            emoji: "💙"
        },
        {
            name: "로",
            description: "차분하고 논리적인 AI",
            emoji: "💜"
        },
        {
            name: "그",
            description: "밝고 편안한 AI",
            emoji: "💛"
        }
    ];


    // =====================================================
    // 세션 ID
    // =====================================================

    const [sessionId] = useState(() => {
        return (
            Date.now().toString() +
            Math.random().toString(36).substring(2)
        );
    });


    // =====================================================
    // 현재 캐릭터 정보
    // =====================================================

    const selectedCharacter = characters.find(
        (item) => item.name === character
    );


    // =====================================================
    // 캐릭터 변경
    // =====================================================

    const changeCharacter = (name) => {

        if (name === character) {
            return;
        }

        if (messages.length > 0) {

            const result = window.confirm(
                "캐릭터를 변경하면 현재 대화가 초기화됩니다.\n변경하시겠습니까?"
            );

            if (!result) {
                return;
            }
        }

        setCharacter(name);
        setMessages([]);
        setAnalysis(null);
        setMessage("");
    };


    // =====================================================
    // AI 채팅
    // =====================================================

    const sendMessage = async () => {

        if (!message.trim()) {
            return;
        }

        if (loading || analyzing) {
            return;
        }

        const userText = message.trim();

        const userMessage = {
            sender: "USER",
            content: userText
        };

        setMessages((prev) => [
            ...prev,
            userMessage
        ]);

        setMessage("");
        setLoading(true);

        try {

            const response = await axios.post(
                "/api/ai/chat",
                {
                    session_id: sessionId,
                    character: character,
                    message: userText,
                    history: messages
                }
            );

            console.log("AI 응답:", response.data);

            const aiMessage = {
                sender: "AI",
                content: response.data.message
            };

            setMessages((prev) => [
                ...prev,
                aiMessage
            ]);

        } catch (error) {

            console.error(
                "AI 채팅 오류:",
                error
            );

            const errorMessage = {
                sender: "AI",
                content:
                    "죄송해요. AI 서버와 연결할 수 없습니다."
            };

            setMessages((prev) => [
                ...prev,
                errorMessage
            ]);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // Enter 입력
    // =====================================================

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            if (e.shiftKey) {
                return;
            }

            e.preventDefault();

            sendMessage();
        }
    };


    // =====================================================
    // 대화 종료
    // =====================================================

    const finishConversation = async () => {

        if (messages.length === 0) {

            alert(
                "먼저 AI와 대화를 해주세요."
            );

            return;
        }

        if (loading || analyzing) {
            return;
        }

        const result = window.confirm(
            "대화를 종료하고\n요약 → 감정 분석 → 일기 작성을 진행할까요?"
        );

        if (!result) {
            return;
        }

        setAnalyzing(true);

        try {

            const response = await axios.post(
                "/api/ai/analyze",
                {
                    session_id: sessionId,
                    character: character,
                    history: messages
                }
            );

            console.log(
                "대화 분석 결과:",
                response.data
            );

            setAnalysis(response.data);

            setTimeout(() => {

                const resultElement =
                    document.getElementById(
                        "analysis-result"
                    );

                if (resultElement) {

                    resultElement.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }, 100);

        } catch (error) {

            console.error(
                "대화 분석 오류:",
                error
            );

            alert(
                "대화 분석 중 오류가 발생했습니다."
            );

        } finally {

            setAnalyzing(false);

        }
    };


    // =====================================================
    // 새 대화
    // =====================================================

    const newConversation = () => {

        if (messages.length > 0) {

            const result = window.confirm(
                "현재 대화를 삭제하고 새 대화를 시작할까요?"
            );

            if (!result) {
                return;
            }
        }

        setMessages([]);
        setAnalysis(null);
        setMessage("");
    };


    // =====================================================
    // 화면
    // =====================================================

    return (

        <div className="talk-ai-page">

            <div className="talk-ai-container">

                {/* Header */}

                <div className="talk-ai-header">

                    <div>

                        <h1 className="talk-ai-title">
                            AI 고민상담
                        </h1>

                        <p className="talk-ai-subtitle">
                            당신의 이야기를 편하게 들려주세요.
                        </p>

                    </div>

                    <button
                        onClick={newConversation}
                        className="talk-ai-new-button"
                    >
                        새 대화
                    </button>

                </div>


                {/* 캐릭터 선택 */}

                <div className="talk-ai-character-section">

                    <h3 className="talk-ai-section-title">
                        상담 캐릭터
                    </h3>

                    <div className="talk-ai-character-list">

                        {characters.map((item) => {

                            const selected =
                                character === item.name;

                            return (

                                <button
                                    key={item.name}
                                    onClick={() =>
                                        changeCharacter(
                                            item.name
                                        )
                                    }
                                    className={
                                        selected
                                            ? "talk-ai-character talk-ai-character-selected"
                                            : "talk-ai-character"
                                    }
                                >

                                    <div className="talk-ai-character-emoji">
                                        {item.emoji}
                                    </div>

                                    <div className="talk-ai-character-name">
                                        {item.name}
                                    </div>

                                    <div className="talk-ai-character-description">
                                        {item.description}
                                    </div>

                                </button>

                            );
                        })}

                    </div>

                </div>


                {/* 현재 캐릭터 */}

                <div className="talk-ai-current-character">

                    <span className="talk-ai-current-emoji">
                        {selectedCharacter?.emoji}
                    </span>

                    <span>
                        지금은{" "}
                        <strong>
                            {character}
                        </strong>
                        와 대화하고 있어요.
                    </span>

                </div>


                {/* 채팅 */}

                <div className="talk-ai-chat-box">

                    {messages.length === 0 && (

                        <div className="talk-ai-empty">

                            <div className="talk-ai-empty-emoji">
                                {selectedCharacter?.emoji}
                            </div>

                            <h3>
                                {character}와
                                이야기를 시작해보세요.
                            </h3>

                            <p>
                                오늘 어떤 고민이 있으신가요?
                            </p>

                        </div>

                    )}


                    {messages.map(
                        (item, index) => (

                            <div
                                key={index}
                                className={
                                    item.sender === "USER"
                                        ? "talk-ai-user-message-wrapper"
                                        : "talk-ai-ai-message-wrapper"
                                }
                            >

                                {item.sender === "AI" && (

                                    <div className="talk-ai-ai-name">
                                        {selectedCharacter?.emoji}
                                        {" "}
                                        {character}
                                    </div>

                                )}

                                <div
                                    className={
                                        item.sender === "USER"
                                            ? "talk-ai-user-message"
                                            : "talk-ai-ai-message"
                                    }
                                >
                                    {item.content}
                                </div>

                            </div>

                        )
                    )}


                    {/* AI 로딩 */}

                    {loading && (

                        <div className="talk-ai-ai-message-wrapper">

                            <div className="talk-ai-ai-name">
                                {selectedCharacter?.emoji}
                                {" "}
                                {character}
                            </div>

                            <div className="talk-ai-ai-message">
                                생각하고 있어요...
                            </div>

                        </div>

                    )}

                </div>


                {/* 입력 */}

                <div className="talk-ai-input-area">

                    <textarea
                        value={message}
                        placeholder={`${character}에게 고민을 이야기해보세요.`}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        className="talk-ai-input"
                        disabled={
                            loading ||
                            analyzing ||
                            analysis !== null
                        }
                        rows={1}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={
                            loading ||
                            analyzing ||
                            !message.trim() ||
                            analysis !== null
                        }
                        className={
                            loading ||
                                analyzing ||
                                !message.trim() ||
                                analysis !== null
                                ? "talk-ai-send-button talk-ai-send-button-disabled"
                                : "talk-ai-send-button"
                        }
                    >
                        보내기
                    </button>

                </div>


                {/* 대화 종료 */}

                {!analysis && (

                    <button
                        onClick={finishConversation}
                        disabled={
                            loading ||
                            analyzing ||
                            messages.length === 0
                        }
                        className={
                            analyzing ||
                                messages.length === 0
                                ? "talk-ai-finish-button talk-ai-finish-button-disabled"
                                : "talk-ai-finish-button"
                        }
                    >

                        {analyzing
                            ? "대화를 분석하고 있어요..."
                            : "대화 종료하기"
                        }

                    </button>

                )}


                {/* 분석 결과 */}

                {analysis && (

                    <div
                        id="analysis-result"
                        className="talk-ai-analysis-result"
                    >

                        <div className="talk-ai-result-header">

                            <h2>
                                오늘의 상담 기록
                            </h2>

                            <p>
                                {character}와의 대화를
                                정리했어요.
                            </p>

                        </div>


                        {/* 감정 */}

                        <div className="talk-ai-emotion-box">

                            <div className="talk-ai-result-emoji">
                                {analysis.emotion?.emoji || "😐"}
                            </div>

                            <div>

                                <div className="talk-ai-result-label">
                                    오늘의 감정
                                </div>

                                <div className="talk-ai-main-emotion">
                                    {
                                        analysis.emotion
                                            ?.main_emotion ||
                                        "알 수 없음"
                                    }
                                </div>

                            </div>

                            <div className="talk-ai-intensity">

                                감정 강도

                                <strong>
                                    {" "}
                                    {
                                        analysis.emotion
                                            ?.intensity || 0
                                    }
                                    /5
                                </strong>

                            </div>

                        </div>


                        {/* 감정 목록 */}

                        {analysis.emotion?.emotions?.length > 0 && (

                            <div className="talk-ai-emotion-list">

                                {analysis.emotion.emotions.map(
                                    (emotion, index) => (

                                        <span
                                            key={index}
                                            className="talk-ai-emotion-tag"
                                        >
                                            {emotion}
                                        </span>

                                    )
                                )}

                            </div>

                        )}


                        {/* 요약 */}

                        <div className="talk-ai-result-box">

                            <div className="talk-ai-result-title">
                                📝 고민 요약
                            </div>

                            <p className="talk-ai-result-text">
                                {analysis.summary}
                            </p>

                        </div>


                        {/* 일기 */}

                        <div className="talk-ai-diary-box">

                            <div className="talk-ai-diary-title">
                                📖 오늘의 감정 일기
                            </div>

                            <div className="talk-ai-diary-content">
                                {analysis.diary}
                            </div>

                        </div>


                        {/* 안내 */}

                        <div className="talk-ai-save-notice">

                            💡 오늘의 감정은 캘린더에서
                            이모지로 확인할 수 있어요.
                            <br />
                            캘린더의 이모지를 누르면
                            오늘의 고민 요약을 확인할 수 있습니다.

                        </div>


                        {/* 새 대화 */}

                        <button
                            onClick={newConversation}
                            className="talk-ai-new-conversation-button"
                        >
                            새로운 대화 시작하기
                        </button>

                    </div>

                )}

            </div>

        </div>

    );
}

export default TalkAI;