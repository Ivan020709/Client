import React, {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import jaxios from '../../utils/jwtUtil'
import AffinityItemBox from './AffinityItemBox';

import "./Lo.css";

import aiImage1 from "../../Img/로로.png";
import aiImage2 from "../../Img/로로2.png";
// import aiImage3 from "../../Img/로로3.png";


function Lo() {

    // =====================================================
    // 로그인 사용자
    // =====================================================

    const loginUser =
        useSelector(state => state.user);


    const character = "로";


    // =====================================================
    // Lo 이미지 랜덤 선택
    // =====================================================

    const aiImages = [
        aiImage1,
        aiImage2,
        // aiImage3
    ];


    const [aiImage] = useState(() => {

        const randomIndex =
            Math.floor(
                Math.random() * aiImages.length
            );

        return aiImages[randomIndex];

    });

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
    // 오늘 상담 완료 여부 Key
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
             * 날짜가 바뀌었다면
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
    // 채팅창 DOM 가져오기
    // =====================================================

    const chatBoxRef =
        useRef(null);


    // =====================================================
    // 메시지가 추가되면 채팅창 자동 스크롤
    // =====================================================

    useEffect(() => {

        const chatBox =
            chatBoxRef.current;


        if (!chatBox) {
            return;
        }


        chatBox.scrollTo({

            top:
                chatBox.scrollHeight,

            behavior:
                "smooth"

        });

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
                "오늘은 이미 상담을 완료했어요.\n내일 다시 로와 이야기해보세요."
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

            sender:
                "USER",

            content:
                userText

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

                        // Spring 서버가 로그인 회원의 친밀도를 조회할 때 사용합니다.
                        userid: loginUser.userid,

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


            // 서버에서 대화 경험치 지급이 끝났으므로 친밀도 표시를 갱신합니다.
            window.dispatchEvent(new Event('affinityUpdated'));

            const aiMessage = {

                sender:
                    "AI",

                content:
                    response.data.message,

                fileUrl: response.data.file_url,

                fileName: response.data.file_name

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

                    sender:
                        "AI",

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
                    "오늘은 이미 상담을 완료했어요.\n내일 다시 로와 이야기해보세요."
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

                            /*
                             * Feel과 동일하게
                             * userid 전달
                             */

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


                // =================================================
                // 오늘 상담 완료 처리
                // =================================================

                const key =
                    getTodayKey();


                localStorage.setItem(

                    key,

                    getToday()

                );


                setTodayCompleted(
                    true
                );


                // =================================================
                // 분석 결과 위치로 이동
                // =================================================

                setTimeout(() => {

                    const resultElement =
                        document.getElementById(
                            "analysis-result"
                        );


                    if (resultElement) {

                        resultElement.scrollIntoView({

                            behavior:
                                "smooth"

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

        <div className="lo-page">

            <div className="lo-container">

                <AffinityItemBox character={character} />


                {/* =================================================
                    Header
                ================================================= */}

                <div className="lo-header">

                    <div>

                        <h1 className="lo-title">
                            로와 고민상담
                        </h1>


                        <p className="lo-subtitle">

                            {todayCompleted

                                ? "오늘의 상담을 완료했어요."

                                : "즐겁고 편안하게 이야기를 나눠보세요."

                            }

                        </p>

                    </div>


                </div>


                {/* =================================================
                    오늘 상담 완료 안내
                ================================================= */}

                {todayCompleted && (

                    <div className="lo-daily-complete">

                        <div className="lo-daily-complete-icon">
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

                                내일 다시 로와 이야기해보세요.

                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    현재 AI
                ================================================= */}

                <div className="lo-current">

                    <span className="lo-current-image">

                        <img
                            src={aiImage}
                            alt="로"
                            className="lo-character-image"
                        />

                    </span>


                    <span>

                        지금은{" "}

                        <strong>
                            로
                        </strong>

                        와 대화하고 있어요.

                    </span>

                </div>


                {/* =================================================
                    채팅
                ================================================= */}

                <div
                    className="lo-chat-box"
                    ref={chatBoxRef}
                >

                    {messages.length === 0 && (

                        <div className="lo-empty">

                            <img
                                src={aiImage}
                                alt="로"
                                className="lo-empty-image"
                            />


                            <h3>

                                {todayCompleted

                                    ? "오늘의 상담을 완료했어요."

                                    : "로와 이야기를 시작해보세요."

                                }

                            </h3>


                            <p>

                                {todayCompleted

                                    ? "내일 다시 새로운 이야기를 나눠보세요."

                                    : "오늘 어떤 이야기가 있으신가요?"

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

                                        ? "lo-user-wrapper"

                                        : "lo-ai-wrapper"

                                }
                            >

                                {item.sender === "AI" && (

                                    <div className="lo-ai-name">

                                        <img
                                            src={aiImage}
                                            alt="로"
                                            className="lo-message-image"
                                        />

                                        <span>
                                            로
                                        </span>

                                    </div>

                                )}


                                <div
                                    className={

                                        item.sender === "USER"

                                            ? "lo-user-message"

                                            : "lo-ai-message"

                                    }
                                >

                                    {item.content}

                                    {item.fileUrl && (
                                        <div>
                                            {item.fileName?.toLowerCase().endsWith('.png') && (
                                                <img src={item.fileUrl} alt={item.fileName} style={{ maxWidth: '280px', display: 'block', marginTop: '10px' }} />
                                            )}
                                            <a href={item.fileUrl} target="_blank" rel="noreferrer" download>
                                                {item.fileName || '생성 파일'} 열기
                                            </a>
                                        </div>
                                    )}

                                </div>

                            </div>

                        )

                    )}


                    {loading && (

                        <div className="lo-ai-wrapper">

                            <div className="lo-ai-name">

                                <img
                                    src={aiImage}
                                    alt="로"
                                    className="lo-message-image"
                                />

                                <span>
                                    로
                                </span>

                            </div>


                            <div className="lo-ai-message">

                                생각하고 있어요...

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    입력
                ================================================= */}

                <div className="lo-input-area">

                    <textarea

                        value={
                            message
                        }

                        placeholder={

                            todayCompleted

                                ? "오늘의 상담을 완료했어요. 내일 다시 이야기해보세요."

                                : "로에게 이야기를 들려주세요."

                        }

                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }

                        onKeyDown={
                            handleKeyDown
                        }

                        className="lo-input"

                        disabled={

                            loading ||
                            analyzing ||
                            analysis !== null ||
                            todayCompleted

                        }

                        rows={1}

                    />


                    <button

                        onClick={
                            sendMessage
                        }

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

                                ? "lo-send-button lo-send-button-disabled"

                                : "lo-send-button"

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

                        onClick={
                            finishConversation
                        }

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

                                ? "lo-finish-button lo-finish-button-disabled"

                                : "lo-finish-button"

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
                        className="lo-analysis"
                    >

                        <div className="lo-result-header">

                            <h2>
                                오늘의 상담 기록
                            </h2>

                            <p>
                                로와의 대화를 정리했어요.
                            </p>

                        </div>


                        {/* =================================================
                            감정
                        ================================================= */}

                        <div className="lo-emotion-box">

                            <div className="lo-result-emoji">

                                {
                                    analysis.emotion?.emoji ||
                                    "😐"
                                }

                            </div>


                            <div>

                                <div className="lo-result-label">
                                    오늘의 감정
                                </div>


                                <div className="lo-main-emotion">

                                    {
                                        analysis.emotion?.main_emotion ||
                                        "알 수 없음"
                                    }

                                </div>

                            </div>


                            <div className="lo-intensity">

                                감정 강도{" "}

                                <strong>

                                    {
                                        analysis.emotion?.intensity ||
                                        0
                                    }/5

                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            감정 목록
                        ================================================= */}

                        {
                            analysis.emotion?.emotions?.length > 0 && (

                                <div className="lo-emotion-list">

                                    {
                                        analysis.emotion.emotions.map(

                                            (emotion, index) => (

                                                <span
                                                    key={index}
                                                    className="lo-emotion-tag"
                                                >

                                                    {emotion}

                                                </span>

                                            )

                                        )
                                    }

                                </div>

                            )
                        }


                        {/* =================================================
                            고민 요약
                        ================================================= */}

                        <div className="lo-result-box">

                            <div className="lo-result-title">

                                📝 고민 요약

                            </div>


                            <p className="lo-result-text">

                                {analysis.summary}

                            </p>

                        </div>


                        {/* =================================================
                            감정 일기
                        ================================================= */}

                        <div className="lo-diary-box">

                            <div className="lo-diary-title">

                                📖 오늘의 감정 일기

                            </div>


                            <div className="lo-diary-content">

                                {analysis.diary}

                            </div>

                        </div>


                        {/* =================================================
                            저장 안내
                        ================================================= */}

                        <div className="lo-save-notice">

                            💡 오늘의 감정은 캘린더에서
                            이모지로 확인할 수 있어요.

                            <br />

                            캘린더의 이모지를 누르면
                            오늘의 고민 요약을 확인할 수 있습니다.

                        </div>


                        {/* =================================================
                            새로운 대화
                        ================================================= */}

                        <div className="talk-ai-result-buttons">

                            <button className="talk-ai-share-button"
                                onClick={shareDiary}
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


export default Lo;
