import React, { useEffect, useState } from "react";

import "./SharedDiary.css";


/* =========================
   감정 정보
========================= */

const emotionInfo = {

    happy: {
        emoji: "😊",
        name: "행복"
    },

    calm: {
        emoji: "😌",
        name: "편안"
    },

    sad: {
        emoji: "😔",
        name: "우울"
    },

    anxious: {
        emoji: "😰",
        name: "불안"
    },

    angry: {
        emoji: "😡",
        name: "화남"
    }

};


/* =========================
   날짜 포맷
========================= */

const formatDiaryDate = value => {

    if (!value) {
        return "";
    }


    const date = new Date(value);


    if (Number.isNaN(date.getTime())) {
        return value;
    }


    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;

};


/* =========================
   SharedDiary
========================= */

function SharedDiary() {

    const [diaryList, setDiaryList] =
        useState([]);


    const [selectedDiary, setSelectedDiary] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState(false);


    /* =========================
       상세 모달 배경 스크롤 잠금
    ========================= */

    useEffect(() => {
        if (!selectedDiary) {
            return;
        }

        // 모달이 열린 동안 배경 body만 고정하고 모달 내부 스크롤은 유지합니다.
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedDiary]);


    /* =========================
       공유 일기 조회
    ========================= */

    useEffect(() => {

        const fetchSharedDiary = async () => {

            try {

                setLoading(true);
                setError(false);


                const response =
                    await fetch(
                        // setupProxy.js가 /api 요청을 Spring 서버 8070 포트로 보냅니다.
                        "/api/diary/shared"
                    );


                if (!response.ok) {

                    throw new Error(
                        "공유 일기 조회 실패"
                    );

                }


                const result =
                    await response.json();


                console.log(
                    "공유 일기 조회 결과:",
                    result
                );


                let list = [];


                if (Array.isArray(result)) {

                    list = result;

                } else if (
                    // 현재 서버는 목록을 diaries라는 이름으로 반환합니다.
                    Array.isArray(result.diaries)
                ) {

                    list = result.diaries;

                } else if (
                    Array.isArray(result.diaryList)
                ) {

                    list =
                        result.diaryList;

                } else if (
                    Array.isArray(result.diary)
                ) {

                    list =
                        result.diary;

                } else if (
                    Array.isArray(result.data)
                ) {

                    list =
                        result.data;

                }


                /* =========================
                   프론트에서 사용할 형태로 통일
                ========================= */

                const formattedList =
                    list
                        .filter(
                            diary =>
                                diary &&
                                (
                                    diary.isShared ??
                                    diary.shared ??
                                    diary.is_shared ??
                                    false
                                )
                        )
                        .map(diary => {

                            const rawDate =
                                diary.diaryDate ||
                                diary.diary_date ||
                                diary.date;


                            return {

                                diaryId:
                                    diary.id ||
                                    diary.diaryId,

                                userid:
                                    diary.userId ||
                                    diary.user_id,

                                nickname:
                                    diary.nickname ||
                                    "익명",

                                date:
                                    formatDiaryDate(
                                        rawDate
                                    ),

                                emotion:
                                    diary.mood ||
                                    diary.emotion ||
                                    "",

                                comment:
                                    diary.content ||
                                    diary.comment ||
                                    "",

                                summary:
                                    diary.summary ||
                                    "",

                                isShared:
                                    diary.isShared ??
                                    diary.shared ??
                                    diary.is_shared ??
                                    false,

                                sessionId:
                                    diary.sessionId ||
                                    diary.session_id ||
                                    null

                            };

                        })
                        .sort(
                            (a, b) =>
                                new Date(b.date) -
                                new Date(a.date)
                        );


                setDiaryList(
                    formattedList
                );


            } catch (err) {

                console.error(
                    "공유 일기 조회 오류:",
                    err
                );

                setError(true);

            } finally {

                setLoading(false);

            }

        };


        fetchSharedDiary();

    }, []);


    /* =========================
       로딩
    ========================= */

    if (loading) {

        return (

            <div className="shared-diary">

                <div className="shared-diary-loading">

                    <div className="loading-icon">
                        📖
                    </div>

                    <p>
                        공유된 감정일기를
                        불러오는 중입니다...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       오류
    ========================= */

    if (error) {

        return (

            <div className="shared-diary">

                <div className="shared-diary-header">
                    <h1>
                        일기 공유
                    </h1>
                    <p>
                        다른 사람들의 감정과
                        이야기를 만나보세요.
                    </p>

                </div>


                <div className="shared-diary-empty">

                    <div>
                        😢
                    </div>

                    <h3>
                        일기를 불러오지 못했습니다.
                    </h3>

                    <p>
                        잠시 후 다시 시도해주세요.
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       화면
    ========================= */

    return (

        <div className="shared-diary">


            {/* =========================
               페이지 헤더
            ========================= */}

            <header className="shared-diary-header">

                <div className="shared-diary-title-icon">
                    💌
                </div>


                <h1>
                    Shared Diary
                </h1>


                <p>
                    다른 사람들의 하루와
                    감정을 만나보세요.
                </p>


                <span className="shared-diary-count">

                    현재 {diaryList.length}개의
                    일기가 공유되고 있어요.

                </span>

            </header>


            {/* =========================
               일기 목록
            ========================= */}

            {diaryList.length === 0 ? (

                <div className="shared-diary-empty">

                    <div className="empty-icon">
                        📖
                    </div>


                    <h3>
                        아직 공유된 일기가 없어요.
                    </h3>


                    <p>
                        누군가의 소중한 하루가
                        공유되면 이곳에 나타납니다.
                    </p>

                </div>

            ) : (

                <div className="shared-diary-board">

                    {diaryList.map(
                        (diary, index) => (

                            <SharedDiaryCard
                                key={
                                    diary.diaryId ||
                                    `${diary.date}-${index}`
                                }

                                diary={diary}

                                index={index}

                                onClick={() =>
                                    setSelectedDiary(
                                        diary
                                    )
                                }

                            />

                        )
                    )}

                </div>

            )}


            {/* =========================
               상세 모달
            ========================= */}

            {selectedDiary && (

                <SharedDiaryModal

                    diary={
                        selectedDiary
                    }

                    onClose={() =>
                        setSelectedDiary(
                            null
                        )
                    }

                />

            )}

        </div>

    );

}


/* =========================================================
   공유 일기 카드
========================================================= */

function SharedDiaryCard({
    diary,
    index,
    onClick
}) {

    const emotion =
        emotionInfo[
            diary.emotion
        ] || {

            emoji: "🙂",
            name: "기록"

        };


    /*
     * 목록에서는 AI 요약을
     * 우선적으로 보여줌
     */

    const previewText =
        diary.summary ||
        diary.comment ||
        "작성된 내용이 없습니다.";


    const shortText =
        previewText.length > 110
            ? `${previewText.slice(0, 110)}...`
            : previewText;


    return (

        <article
            className={`shared-diary-card card-${index % 5}`}
            onClick={onClick}
        >


            {/* =========================
               카드 상단
            ========================= */}

            <div className="shared-card-top">

                <span className="shared-card-date">

                    {diary.date}

                </span>


                <span className="shared-card-emotion">

                    {emotion.emoji}

                </span>

            </div>


            {/* =========================
               작성자
            ========================= */}

            <div className="shared-card-user">

                <span className="shared-card-avatar">

                    {
                        diary.nickname
                            ?.charAt(0) ||
                        "?"
                    }

                </span>


                <strong>
                    {diary.nickname}
                </strong>

            </div>


            {/* =========================
               감정
            ========================= */}

            <div className="shared-card-emotion-name">

                {emotion.name}

            </div>


            {/* =========================
               내용
            ========================= */}

            <div className="shared-card-content">

                {shortText}

            </div>


            {/* =========================
               하단
            ========================= */}

            <div className="shared-card-bottom">

                <span>
                    💌 공유된 일기
                </span>


                <span>
                    자세히 보기 →
                </span>

            </div>

        </article>

    );

}


/* =========================================================
   공유 일기 상세 모달
========================================================= */

function SharedDiaryModal({
    diary,
    onClose
}) {

    const emotion =
        emotionInfo[
            diary.emotion
        ] || {

            emoji: "🙂",
            name: "기록"

        };


    return (

        <div
            className="shared-diary-modal-overlay"
            onClick={onClose}
        >

            <div
                className="shared-diary-modal"
                onClick={e =>
                    e.stopPropagation()
                }
            >


                {/* =========================
                   닫기
                ========================= */}

                <button
                    type="button"
                    className="shared-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>


                {/* =========================
                   감정 아이콘
                ========================= */}

                <div className="shared-modal-emotion-icon">

                    {emotion.emoji}

                </div>


                {/* =========================
                   헤더
                ========================= */}

                <div className="shared-modal-header">

                    <div>

                        <h2>
                            {diary.nickname}
                            님의 감정일기
                        </h2>


                        <span>
                            {diary.date}
                        </span>

                    </div>


                    <div className="shared-modal-emotion">

                        <span>
                            {emotion.emoji}
                        </span>

                        <small>
                            {emotion.name}
                        </small>

                    </div>

                </div>


                {/* =========================
                   AI 요약
                ========================= */}

                {diary.summary && (

                    <div className="shared-diary-summary">

                        <h3>
                            🤖 AI 상담 요약
                        </h3>


                        <p>
                            {diary.summary}
                        </p>

                    </div>

                )}


                {/* =========================
                   일기 내용
                ========================= */}

                <div className="shared-modal-content">

                    <h3>
                        오늘의 이야기
                    </h3>


                    <p>
                        {
                            diary.comment ||
                            "작성된 내용이 없습니다."
                        }
                    </p>

                </div>


                {/* =========================
                   공유 상태
                ========================= */}

                <div className="shared-modal-footer">

                    <span>
                        💌 공유된 감정일기
                    </span>


                    <button
                        type="button"
                        onClick={onClose}
                    >
                        닫기
                    </button>

                </div>

            </div>

        </div>

    );

}


export default SharedDiary;
