import React, { useState } from "react";
import axios from "axios";

function TalkAI() {

    // =====================================================
    // 상태
    // =====================================================

    // 현재 선택한 캐릭터
    const [character, setCharacter] = useState("필");

    // 입력 메시지
    const [message, setMessage] = useState("");

    // 대화 목록
    const [messages, setMessages] = useState([]);

    // AI 답변 로딩
    const [loading, setLoading] = useState(false);

    // 분석 중
    const [analyzing, setAnalyzing] = useState(false);

    // 분석 결과
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


        // -------------------------------------------------
        // 사용자 메시지를 화면에 먼저 추가
        // -------------------------------------------------

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

            // -------------------------------------------------
            // Spring Boot
            //
            // React
            // ↓
            // /api/ai/chat
            // ↓
            // Spring Boot :8070
            // ↓
            // FastAPI :8000/chat
            // -------------------------------------------------

            const response = await axios.post(
                "/api/ai/chat",
                {
                    session_id: sessionId,
                    character: character,
                    message: userText,

                    // 현재까지의 대화
                    history: messages
                }
            );


            console.log("AI 응답:", response.data);


            // -------------------------------------------------
            // FastAPI → Spring → React
            //
            // {
            //     session_id: "...",
            //     character: "필",
            //     message: "AI 답변"
            // }
            // -------------------------------------------------

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

            // Shift + Enter = 줄바꿈
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

            // -------------------------------------------------
            // Spring Boot
            //
            // /api/ai/analyze
            //
            // ↓
            //
            // FastAPI
            //
            // /analyze
            // -------------------------------------------------

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


            // -------------------------------------------------
            // 분석 결과 저장
            // -------------------------------------------------

            setAnalysis(response.data);


            // -------------------------------------------------
            // 결과 위치로 이동
            // -------------------------------------------------

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

        <div style={styles.page}>

            <div style={styles.container}>

                {/* =================================================
                    Header
                ================================================= */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.title}>
                            AI 고민상담
                        </h1>

                        <p style={styles.subtitle}>
                            당신의 이야기를 편하게 들려주세요.
                        </p>

                    </div>


                    <button
                        onClick={newConversation}
                        style={styles.newButton}
                    >
                        새 대화
                    </button>

                </div>


                {/* =================================================
                    캐릭터 선택
                ================================================= */}

                <div style={styles.characterSection}>

                    <h3 style={styles.sectionTitle}>
                        상담 캐릭터
                    </h3>


                    <div style={styles.characterList}>

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
                                    style={
                                        selected
                                            ? styles.characterSelected
                                            : styles.character
                                    }
                                >

                                    <div
                                        style={
                                            styles.characterEmoji
                                        }
                                    >
                                        {item.emoji}
                                    </div>


                                    <div
                                        style={
                                            styles.characterName
                                        }
                                    >
                                        {item.name}
                                    </div>


                                    <div
                                        style={
                                            styles.characterDescription
                                        }
                                    >
                                        {item.description}
                                    </div>

                                </button>

                            );
                        })}

                    </div>

                </div>


                {/* =================================================
                    현재 캐릭터
                ================================================= */}

                <div style={styles.currentCharacter}>

                    <span style={styles.currentEmoji}>
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


                {/* =================================================
                    채팅
                ================================================= */}

                <div style={styles.chatBox}>

                    {messages.length === 0 && (

                        <div style={styles.empty}>

                            <div
                                style={
                                    styles.emptyEmoji
                                }
                            >
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
                                style={
                                    item.sender === "USER"
                                        ? styles.userMessageWrapper
                                        : styles.aiMessageWrapper
                                }
                            >

                                {/* AI 이름 */}

                                {item.sender === "AI" && (

                                    <div
                                        style={
                                            styles.aiName
                                        }
                                    >
                                        {selectedCharacter?.emoji}
                                        {" "}
                                        {character}
                                    </div>

                                )}


                                <div
                                    style={
                                        item.sender === "USER"
                                            ? styles.userMessage
                                            : styles.aiMessage
                                    }
                                >
                                    {item.content}
                                </div>

                            </div>

                        )
                    )}


                    {/* AI 로딩 */}

                    {loading && (

                        <div
                            style={
                                styles.aiMessageWrapper
                            }
                        >

                            <div
                                style={
                                    styles.aiName
                                }
                            >
                                {selectedCharacter?.emoji}
                                {" "}
                                {character}
                            </div>

                            <div
                                style={
                                    styles.aiMessage
                                }
                            >
                                생각하고 있어요...
                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    입력
                ================================================= */}

                <div style={styles.inputArea}>

                    <textarea
                        value={message}
                        placeholder={`${character}에게 고민을 이야기해보세요.`}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        style={styles.input}
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
                        style={
                            loading ||
                                analyzing ||
                                !message.trim() ||
                                analysis !== null
                                ? styles.sendButtonDisabled
                                : styles.sendButton
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
                        style={
                            analyzing ||
                                messages.length === 0
                                ? styles.finishButtonDisabled
                                : styles.finishButton
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
                        style={styles.analysisResult}
                    >

                        <div style={styles.resultHeader}>

                            <h2>
                                오늘의 상담 기록
                            </h2>

                            <p>
                                {character}와의 대화를
                                정리했어요.
                            </p>

                        </div>


                        {/* =================================================
                            감정
                        ================================================= */}

                        <div style={styles.emotionBox}>

                            <div
                                style={
                                    styles.resultEmoji
                                }
                            >
                                {analysis.emotion?.emoji ||
                                    "😐"
                                }
                            </div>


                            <div>

                                <div
                                    style={
                                        styles.resultLabel
                                    }
                                >
                                    오늘의 감정
                                </div>


                                <div
                                    style={
                                        styles.mainEmotion
                                    }
                                >
                                    {
                                        analysis.emotion
                                            ?.main_emotion ||
                                        "알 수 없음"
                                    }
                                </div>

                            </div>


                            <div
                                style={
                                    styles.intensity
                                }
                            >

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


                        {/* =================================================
                            감정 목록
                        ================================================= */}

                        {analysis.emotion?.emotions?.length > 0 && (

                            <div
                                style={
                                    styles.emotionList
                                }
                            >

                                {analysis.emotion.emotions.map(
                                    (emotion, index) => (

                                        <span
                                            key={index}
                                            style={
                                                styles.emotionTag
                                            }
                                        >
                                            {emotion}
                                        </span>

                                    )
                                )}

                            </div>

                        )}


                        {/* =================================================
                            요약
                        ================================================= */}

                        <div style={styles.resultBox}>

                            <div
                                style={
                                    styles.resultTitle
                                }
                            >
                                📝 고민 요약
                            </div>


                            <p
                                style={
                                    styles.resultText
                                }
                            >
                                {analysis.summary}
                            </p>

                        </div>


                        {/* =================================================
                            일기
                        ================================================= */}

                        <div style={styles.diaryBox}>

                            <div
                                style={
                                    styles.diaryTitle
                                }
                            >
                                📖 오늘의 감정 일기
                            </div>


                            <div
                                style={
                                    styles.diaryContent
                                }
                            >
                                {analysis.diary}
                            </div>

                        </div>


                        {/* =================================================
                            안내
                        ================================================= */}

                        <div style={styles.saveNotice}>

                            💡 오늘의 감정은 캘린더에서
                            이모지로 확인할 수 있어요.
                            <br />
                            캘린더의 이모지를 누르면
                            오늘의 고민 요약을 확인할 수 있습니다.

                        </div>


                        {/* =================================================
                            새 대화
                        ================================================= */}

                        <button
                            onClick={newConversation}
                            style={
                                styles.newConversationButton
                            }
                        >
                            새로운 대화 시작하기
                        </button>

                    </div>

                )}

            </div>

        </div>

    );
}


// =========================================================
// Style
// =========================================================

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "40px 20px",
        boxSizing: "border-box"
    },


    container: {
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "30px",
        boxSizing: "border-box",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    },


    // =====================================================
    // Header
    // =====================================================

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },


    title: {
        margin: 0,
        fontSize: "28px"
    },


    subtitle: {
        marginTop: "8px",
        color: "#888"
    },


    newButton: {
        padding: "10px 15px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        cursor: "pointer"
    },


    // =====================================================
    // Character
    // =====================================================

    characterSection: {
        marginBottom: "20px"
    },


    sectionTitle: {
        marginBottom: "12px"
    },


    characterList: {
        display: "flex",
        gap: "10px"
    },


    character: {
        flex: 1,
        padding: "15px 10px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "#fff",
        cursor: "pointer"
    },


    characterSelected: {
        flex: 1,
        padding: "15px 10px",
        border: "2px solid #555",
        borderRadius: "12px",
        backgroundColor: "#f4f4f4",
        cursor: "pointer"
    },


    characterEmoji: {
        fontSize: "30px",
        marginBottom: "8px"
    },


    characterName: {
        fontWeight: "bold",
        fontSize: "17px",
        marginBottom: "5px"
    },


    characterDescription: {
        fontSize: "12px",
        color: "#888"
    },


    currentCharacter: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 15px",
        backgroundColor: "#fafafa",
        borderRadius: "10px",
        marginBottom: "15px",
        color: "#555"
    },


    currentEmoji: {
        fontSize: "20px"
    },


    // =====================================================
    // Chat
    // =====================================================

    chatBox: {
        height: "500px",
        overflowY: "auto",
        border: "1px solid #eee",
        borderRadius: "15px",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#fcfcfc"
    },


    empty: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#888",
        textAlign: "center"
    },


    emptyEmoji: {
        fontSize: "50px",
        marginBottom: "10px"
    },


    userMessageWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "15px"
    },


    aiMessageWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: "15px"
    },


    aiName: {
        fontSize: "12px",
        color: "#777",
        marginBottom: "5px"
    },


    userMessage: {
        maxWidth: "70%",
        padding: "12px 15px",
        borderRadius: "15px 15px 3px 15px",
        backgroundColor: "#333",
        color: "#fff",
        lineHeight: "1.5",
        whiteSpace: "pre-wrap"
    },


    aiMessage: {
        maxWidth: "70%",
        padding: "12px 15px",
        borderRadius: "15px 15px 15px 3px",
        backgroundColor: "#eee",
        color: "#333",
        lineHeight: "1.5",
        whiteSpace: "pre-wrap"
    },


    // =====================================================
    // Input
    // =====================================================

    inputArea: {
        display: "flex",
        gap: "10px",
        marginTop: "15px"
    },


    input: {
        flex: 1,
        resize: "none",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "13px",
        fontSize: "14px",
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box"
    },


    sendButton: {
        width: "80px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "#333",
        color: "#fff",
        cursor: "pointer"
    },


    sendButtonDisabled: {
        width: "80px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "#ccc",
        color: "#fff",
        cursor: "not-allowed"
    },


    // =====================================================
    // Finish
    // =====================================================

    finishButton: {
        width: "100%",
        marginTop: "12px",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "#555",
        color: "#fff",
        cursor: "pointer",
        fontSize: "15px"
    },


    finishButtonDisabled: {
        width: "100%",
        marginTop: "12px",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "#ccc",
        color: "#fff",
        cursor: "not-allowed",
        fontSize: "15px"
    },


    // =====================================================
    // Analysis
    // =====================================================

    analysisResult: {
        marginTop: "30px",
        borderTop: "1px solid #eee",
        paddingTop: "30px"
    },


    resultHeader: {
        textAlign: "center",
        marginBottom: "25px"
    },


    // =====================================================
    // Emotion
    // =====================================================

    emotionBox: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "20px",
        borderRadius: "15px",
        backgroundColor: "#f7f7f7",
        marginBottom: "10px"
    },


    resultEmoji: {
        fontSize: "45px"
    },


    resultLabel: {
        fontSize: "12px",
        color: "#888"
    },


    mainEmotion: {
        fontSize: "20px",
        fontWeight: "bold",
        marginTop: "3px"
    },


    intensity: {
        marginLeft: "auto",
        fontSize: "13px",
        color: "#888"
    },


    emotionList: {
        display: "flex",
        gap: "7px",
        flexWrap: "wrap",
        marginBottom: "20px"
    },


    emotionTag: {
        padding: "6px 10px",
        borderRadius: "20px",
        backgroundColor: "#eee",
        fontSize: "12px"
    },


    // =====================================================
    // Summary
    // =====================================================

    resultBox: {
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "15px",
        marginBottom: "15px"
    },


    resultTitle: {
        fontWeight: "bold",
        marginBottom: "12px"
    },


    resultText: {
        lineHeight: "1.7",
        color: "#444",
        whiteSpace: "pre-wrap"
    },


    // =====================================================
    // Diary
    // =====================================================

    diaryBox: {
        padding: "25px",
        borderRadius: "15px",
        backgroundColor: "#fafafa",
        marginBottom: "15px"
    },


    diaryTitle: {
        fontWeight: "bold",
        fontSize: "18px",
        marginBottom: "20px"
    },


    diaryContent: {
        lineHeight: "2",
        color: "#444",
        whiteSpace: "pre-wrap"
    },


    // =====================================================
    // Notice
    // =====================================================

    saveNotice: {
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
        color: "#777",
        fontSize: "13px",
        lineHeight: "1.6",
        marginBottom: "15px"
    },


    // =====================================================
    // New Conversation
    // =====================================================

    newConversationButton: {
        width: "100%",
        padding: "14px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "#fff",
        cursor: "pointer"
    }

};


export default TalkAI;