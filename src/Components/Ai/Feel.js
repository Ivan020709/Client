import React, {
    useState,
    useRef,
    useEffect
} from "react";

import axios from "axios";
import { useSelector } from "react-redux";

import "./Feel.css";

import aiImage1 from "../../Img/필필.png";
import aiImage2 from "../../Img/필로그3.png";
import aiImage3 from "../../Img/필필1.png";

import jaxios from '../../utils/jwtUtil'


function Feel() {

    const loginUser = useSelector(state => state.user);

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
    // 감정일기 공유
    // =====================================================

    const shareDiary = () => {

        // 대화 종료 후 서버에서 받은 일기 번호가 있어야
        // 어떤 감정일기를 공유할지 서버에 알려줄 수 있습니다.
        if (!analysis || !analysis.diaryId) {
            alert("공유할 감정일기를 찾을 수 없습니다.");
            return;
        }

        // 다른 사용자의 일기를 변경하지 않도록 로그인 회원 번호도 확인합니다.
        if (!loginUser || !loginUser.userid) {
            alert("로그인이 필요합니다.");
            return;
        }

        // RequestBody 없이 주소의 일기 번호와 params 값만 서버에 전달합니다.
        // shared가 true이면 공개 일기로 변경됩니다.
        jaxios.post(
            `/api/diary/${analysis.diaryId}/share`,
            null,
            {
                params: {
                    userId: loginUser.userid,
                    shared: true
                }
            }
        )
            .then((result) => {
                if (result.data.msg === "OK") {
                    alert("감정일기가 공유되었습니다.");
                } else {
                    alert("감정일기 공유에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("감정일기 공유 오류:", error);
                alert("감정일기 공유 중 오류가 발생했습니다.");
            });
    };


    // =====================================================
    // 오늘 날짜
    // =====================================================

    const getToday = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // =====================================================
    // 오늘 상담 완료 여부
    // =====================================================

    const getTodayKey = () => {

        const userid =
            loginUser?.userid || "guest";

        return `dailyCounselingCompleted_${userid}`;

    };


    const [todayCompleted, setTodayCompleted] =
        useState(false);


    // =====================================================
    // 페이지 진입 시 오늘 상담 여부 확인
    // =====================================================

    useEffect(() => {

        if (!loginUser?.userid) {
            return;
        }


        const key =
            getTodayKey();

        const completedDate =
            localStorage.getItem(key);


        /*
         * 오늘 이미 상담을 종료했다면
         * 오늘은 다시 상담할 수 없음
         */

        if (completedDate === getToday()) {

            setTodayCompleted(true);

        } else {

            /*
             * 날짜가 바뀌었으면
             * 이전 기록 삭제
             */

            localStorage.removeItem(key);

            setTodayCompleted(false);

        }

    }, [loginUser]);


    // =====================================================
    // 상태
    // =====================================================

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [analyzing, setAnalyzing] =
        useState(false);

    const [analysis, setAnalysis] =
        useState(null);


    // =====================================================
    // 채팅창 Ref
    // =====================================================

    const chatBoxRef =
        useRef(null);


    // =====================================================
    // 채팅 자동 스크롤
    // =====================================================

    useEffect(() => {

        const chatBox =
            chatBoxRef.current;

        if (!chatBox) {
            return;
        }

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }, [messages, loading]);


    // =====================================================
    // 세션 ID
    // =====================================================

    const [sessionId] =
        useState(() => {

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

        /*
         * 오늘 상담을 이미 완료했다면
         * 메시지 전송 금지
         */

        if (todayCompleted) {

            alert(
                "오늘은 이미 상담을 완료했어요.\n내일 다시 필과 이야기해보세요."
            );

            return;
        }


        if (!message.trim()) {
            return;
        }


        if (loading || analyzing) {
            return;
        }


        const userText =
            message.trim();


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

            const response =
                await jaxios.post(

                    "/api/ai/chat",

                    {
                        session_id:
                            sessionId,

                        character:
                            character,

                        message:
                            userText,

                        history:
                            messages
                    },

                    {
                        withCredentials:
                            true
                    }

                );


            const aiMessage = {

                sender: "AI",

                content:
                    response.data.message

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

    const finishConversation =
        async () => {

            /*
             * 오늘 이미 상담 완료
             */

            if (todayCompleted) {

                alert(
                    "오늘은 이미 상담을 완료했어요.\n내일 다시 필과 이야기해보세요."
                );

                return;

            }


            if (messages.length === 0) {

                alert(
                    "먼저 AI와 대화를 해주세요."
                );

                return;

            }


            if (loading || analyzing) {
                return;
            }


            const result =
                window.confirm(
                    "대화를 종료하고\n요약 → 감정 분석 → 일기 작성을 진행할까요?"
                );


            if (!result) {
                return;
            }


            setAnalyzing(true);


            try {

                const response =
                    await jaxios.post(

                        "/api/ai/analyze",

                        {
                            userid:
                                loginUser.userid,

                            session_id:
                                sessionId,

                            character:
                                character,

                            history:
                                messages
                        },

                        {
                            withCredentials:
                                true
                        }

                    );


                setAnalysis(
                    response.data
                );


                /*
                 * =========================================
                 * 오늘 상담 완료 처리
                 * =========================================
                 */

                const key =
                    getTodayKey();


                localStorage.setItem(
                    key,
                    getToday()
                );


                setTodayCompleted(
                    true
                );


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

    const newConversation =
        () => {

            /*
             * 오늘 상담 완료 상태라면
             * 새 대화를 시작할 수 없음
             */

            if (todayCompleted) {

                alert(
                    "오늘 상담은 이미 완료했어요.\n내일 다시 새로운 대화를 시작할 수 있어요."
                );

                return;

            }


            if (messages.length > 0) {

                const result =
                    window.confirm(
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
                            {todayCompleted
                                ? "오늘의 상담을 완료했어요."
                                : "당신의 이야기를 편하게 들려주세요."
                            }
                        </p>

                    </div>

                </div>


                {/* =================================================
                    오늘 상담 완료 안내
                ================================================= */}

                {todayCompleted && (

                    <div className="talk-ai-daily-complete">

                        <div className="talk-ai-daily-complete-icon">
                            🌿
                        </div>


                        <div>

                            <strong>
                                오늘의 상담을 완료했어요.
                            </strong>


                            <p>
                                오늘 나눈 이야기는
                                감정 기록으로 저장되었어요.
                                <br />
                                내일 다시 필과 이야기해보세요.
                            </p>

                        </div>

                    </div>

                )}


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

                <div
                    className="talk-ai-chat-box"
                    ref={chatBoxRef}
                >

                    {messages.length === 0 && (

                        <div className="talk-ai-empty">

                            <img
                                src={aiImage}
                                alt="필"
                                className="talk-ai-empty-image"
                            />


                            <h3>

                                {todayCompleted
                                    ? "오늘의 상담을 완료했어요."
                                    : "필과 이야기를 시작해보세요."
                                }

                            </h3>


                            <p>

                                {todayCompleted
                                    ? "내일 다시 새로운 이야기를 나눠보세요."
                                    : "오늘 어떤 고민이 있으신가요?"
                                }

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
                        placeholder={
                            todayCompleted
                                ? "오늘의 상담을 완료했어요. 내일 다시 이야기해보세요."
                                : "필에게 고민을 이야기해보세요."
                        }
                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        className="talk-ai-input"
                        disabled={
                            loading ||
                            analyzing ||
                            analysis !== null ||
                            todayCompleted
                        }
                        rows={1}
                    />


                    <button
                        onClick={sendMessage}
                        disabled={
                            loading ||
                            analyzing ||
                            !message.trim() ||
                            analysis !== null ||
                            todayCompleted
                        }
                        className={
                            loading ||
                                analyzing ||
                                !message.trim() ||
                                analysis !== null ||
                                todayCompleted

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
                            messages.length === 0 ||
                            todayCompleted
                        }
                        className={
                            analyzing ||
                                messages.length === 0 ||
                                todayCompleted

                                ? "talk-ai-finish-button talk-ai-finish-button-disabled"

                                : "talk-ai-finish-button"
                        }
                    >

                        {todayCompleted

                            ? "오늘 상담 완료"

                            : analyzing

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


                        {/* =================================================
                            감정
                        ================================================= */}

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


                        {/* =================================================
                            감정 목록
                        ================================================= */}

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


                        {/* =================================================
                            고민 요약
                        ================================================= */}

                        <div className="talk-ai-result-box">

                            <div className="talk-ai-result-title">
                                📝 고민 요약
                            </div>


                            <p className="talk-ai-result-text">
                                {analysis.summary}
                            </p>

                        </div>


                        {/* =================================================
                            감정 일기
                        ================================================= */}

                        <div className="talk-ai-diary-box">

                            <div className="talk-ai-diary-title">
                                📖 오늘의 감정 일기
                            </div>


                            <div className="talk-ai-diary-content">
                                {analysis.diary}
                            </div>

                        </div>


                        {/* =================================================
                            저장 안내
                        ================================================= */}

                        <div className="talk-ai-save-notice">

                            💡 오늘의 감정은 캘린더에서
                            이모지로 확인할 수 있어요.

                            <br />

                            캘린더의 이모지를 누르면
                            오늘의 고민 요약을 확인할 수 있습니다.

                        </div>


                        {/* =================================================
                            결과 버튼
                        ================================================= */}

                        <div className="talk-ai-result-buttons">

                            {/* 방금 저장된 감정일기를 공개 상태로 변경합니다. */}
                            <button
                                onClick={shareDiary}
                                className="talk-ai-share-button"
                            >
                                공유하기
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


export default Feel;
