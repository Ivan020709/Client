import React, { useState } from "react";
import axios from "axios";

import "./Feel.css";

import aiImage1 from "../../Img/필필.png";
import aiImage2 from "../../Img/필로그3.png";
import aiImage3 from "../../Img/필필1.png";


function Feel() {

    const character = "필";


    // =====================================================
    // 필 이미지 랜덤 선택
    // =====================================================

    const aiImages = [
        aiImage1,
        aiImage2,
        aiImage3
    ];


    const [aiImage] = useState(() => {

        const randomIndex =
            Math.floor(
                Math.random() * aiImages.length
            );

        return aiImages[randomIndex];

    });


    // =====================================================
    // 상태
    // =====================================================

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [analysis, setAnalysis] = useState(null);


    // =====================================================
    // 세션 ID
    // =====================================================

    const [sessionId] = useState(() => {

        return (
            Date.now().toString() +
            Math.random()
                .toString(36)
                .substring(2)
        );

    });


    // =====================================================
    // AI 메시지 전송
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
                },
                {
                    withCredentials: true
                }
            );


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


            setMessages((prev) => [
                ...prev,
                {
                    sender: "AI",
                    content:
                        "죄송해요. AI 서버와 연결할 수 없습니다."
                }
            ]);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // Enter
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
                },
                {
                    withCredentials: true
                }
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


                {/* =================================================
                    Header
                ================================================= */}

                <div className="talk-ai-header">

                    <div>

                        <h1 className="talk-ai-title">
                            필과 고민상담
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


                {/* =================================================
                    현재 AI
                ================================================= */}

                <div className="talk-ai-current-character">

                    <span className="talk-ai-current-emoji">

                        <img
                            src={aiImage}
                            alt="필"
                            className="talk-ai-character-image"
                        />

                    </span>


                    <span>

                        지금은{" "}

                        <strong>
                            필
                        </strong>

                        와 대화하고 있어요.

                    </span>

                </div>


                {/* =================================================
                    채팅
                ================================================= */}

                <div className="talk-ai-chat-box">


                    {messages.length === 0 && (

                        <div className="talk-ai-empty">

                            <img
                                src={aiImage}
                                alt="필"
                                className="talk-ai-empty-image"
                            />

                            <h3>
                                필과 이야기를 시작해보세요.
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

                                        <img
                                            src={aiImage}
                                            alt="필"
                                            className="talk-ai-message-image"
                                        />

                                        <span>
                                            필
                                        </span>

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


                    {loading && (

                        <div className="talk-ai-ai-message-wrapper">

                            <div className="talk-ai-ai-name">

                                <img
                                    src={aiImage}
                                    alt="필"
                                    className="talk-ai-message-image"
                                />

                                <span>
                                    필
                                </span>

                            </div>

                            <div className="talk-ai-ai-message">
                                생각하고 있어요...
                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    입력
                ================================================= */}

                <div className="talk-ai-input-area">

                    <textarea
                        value={message}
                        placeholder="필에게 고민을 이야기해보세요."
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


                {/* =================================================
                    대화 종료
                ================================================= */}

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


                {/* =================================================
                    분석 결과
                ================================================= */}

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
                                필과의 대화를 정리했어요.
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

                                    {analysis.emotion?.main_emotion ||
                                        "알 수 없음"}

                                </div>

                            </div>


                            <div className="talk-ai-intensity">

                                감정 강도

                                <strong>
                                    {" "}
                                    {analysis.emotion?.intensity || 0}/5
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


                        <div className="talk-ai-save-notice">

                            💡 오늘의 감정은 캘린더에서
                            이모지로 확인할 수 있어요.

                            <br />

                            캘린더의 이모지를 누르면
                            오늘의 고민 요약을 확인할 수 있습니다.

                        </div>


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


export default Feel;