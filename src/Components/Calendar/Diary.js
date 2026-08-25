import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import "./Diary.css";


/* =========================================================
   API
========================================================= */

const DIARY_API = "/api/diary";


/* =========================================================
   감정 정보
========================================================= */

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


/* =========================================================
   한글 감정 → 영어 감정
========================================================= */

const moodMap = {
    행복: "happy",
    기쁨: "happy",

    편안: "calm",
    평온: "calm",

    우울: "sad",
    슬픔: "sad",

    불안: "anxious",
    걱정: "anxious",

    화남: "angry",
    분노: "angry"
};


/* =========================================================
   날짜 포맷
========================================================= */

const formatDiaryDate = (value) => {

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


/* =========================================================
   감정일기 목록
========================================================= */

function EmotionDiary({
    diaryList,
    setSelectedDiary,
    selectedDiary
}) {

    /* =========================
           상세 모달 배경 스크롤 잠금
        ========================= */

    useEffect(() => {
        if (!selectedDiary) {
            return;
        }

        // 모달을 열기 전 body의 값을 기억했다가 닫을 때 되돌립니다.
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedDiary]);

    return (
        <div className="diary-section">

            <div className="section-header">

                <h2>감정일기</h2>

                <p>
                    나의 하루와 감정을
                    기록한 일기를 확인해보세요.
                </p>

            </div>


            {diaryList.length === 0 ? (

                <div className="empty-diary">

                    <div>📖</div>

                    <p>
                        작성한 감정일기가 없습니다.
                    </p>

                    <span>
                        감정 달력에서 하루의 감정을
                        기록해보세요.
                    </span>

                </div>

            ) : (

                <div className="diary-board">

                    <div className="board-header">

                        <span>
                            MY EMOTION DIARY
                        </span>

                        <span>
                            총 {diaryList.length}개의 기록
                        </span>

                    </div>


                    <div className="diary-pin-board">

                        {diaryList.map(
                            (diary, index) => (

                                <DiaryMemo
                                    key={
                                        diary.diaryId ||
                                        diary.id ||
                                        diary.date ||
                                        index
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

                </div>

            )}


            {/* =================================================
               일기 상세 모달
            ================================================= */}

            {selectedDiary && (

                <div
                    className="diary-modal-overlay"
                    onClick={() =>
                        setSelectedDiary(null)
                    }
                >

                    <div
                        className="diary-modal"
                        onClick={e =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="diary-modal-close"
                            onClick={() =>
                                setSelectedDiary(null)
                            }
                        >
                            ×
                        </button>


                        <div className="diary-modal-icon">

                            {
                                emotionInfo[
                                    selectedDiary.emotion
                                ]?.emoji || "📖"
                            }

                        </div>


                        <div className="diary-modal-header">

                            <div>

                                <h3>
                                    {selectedDiary.nickname ||
                                        "나"}님의 감정일기
                                </h3>

                                <span>
                                    {selectedDiary.date}
                                </span>

                            </div>


                            <div className="diary-modal-emotion">

                                <span>
                                    {
                                        emotionInfo[
                                            selectedDiary.emotion
                                        ]?.emoji || "🙂"
                                    }
                                </span>

                                <small>

                                    {
                                        emotionInfo[
                                            selectedDiary.emotion
                                        ]?.name ||
                                        selectedDiary.emotion ||
                                        "기록"
                                    }

                                </small>

                            </div>

                        </div>


                        {/* AI 요약 */}

                        {selectedDiary.summary && (

                            <div className="diary-summary">

                                <h4>
                                    🤖 AI 상담 요약
                                </h4>

                                <p>
                                    {selectedDiary.summary}
                                </p>

                            </div>

                        )}


                        {/* 일기 내용 */}

                        <div className="diary-modal-content">

                            {selectedDiary.comment ||
                                "작성된 내용이 없습니다."}

                        </div>


                        <button
                            type="button"
                            className="diary-modal-close-btn"
                            onClick={() =>
                                setSelectedDiary(null)
                            }
                        >
                            닫기
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}


/* =========================================================
   게시판 메모
========================================================= */

function DiaryMemo({
    diary,
    index,
    onClick
}) {

    const emotion =
        emotionInfo[diary.emotion] || {};


    const text =
        diary.summary ||
        diary.comment ||
        "";


    const previewText =
        text.length > 55
            ? `${text.slice(0, 55)}...`
            : text;


    return (

        <div
            className={`diary-memo-wrap memo-${index % 5}`}
            onClick={onClick}
        >

            <div className="memo-pin">
                📌
            </div>


            <div className="diary-memo">

                <div className="memo-top">

                    <span className="memo-date">
                        {diary.date}
                    </span>


                    <span className="memo-emotion">

                        {emotion.emoji || "🙂"}

                    </span>

                </div>


                <div className="memo-content">

                    <p>
                        {previewText ||
                            "작성된 내용이 없습니다."}
                    </p>

                </div>


                <div className="memo-bottom">

                    <span className="memo-writer">

                        {diary.nickname || "나"}

                    </span>


                    <span className="memo-hint">
                        CLICK
                    </span>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   감정 달력
========================================================= */

function EmotionCalendar({

    currentDate,

    changeMonth,

    selectedDate,

    selectDate,

    selectedEmotion,

    setSelectedEmotion,

    comment,

    setComment,

    saveDiary,

    calendarData,

    emotionCount,

    isEditing,

    setIsEditing

}) {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    /* =====================================================
       달력 날짜 계산
    ===================================================== */

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const lastDate =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* =====================================================
       달력 생성
    ===================================================== */

    const renderCalendar = () => {

        const days = [];


        /* 빈 칸 */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            days.push(

                <div
                    key={`empty-${i}`}
                    className="calendar-day empty"
                />

            );

        }


        /* 날짜 */

        for (
            let day = 1;
            day <= lastDate;
            day++
        ) {

            const dateKey =
                `${year}-${String(
                    month + 1
                ).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`;


            const data =
                calendarData[dateKey];


            const emotion =
                data?.emotion;


            const isSelected =
                selectedDate === dateKey;


            days.push(

                <div
                    key={day}
                    className={`calendar-day ${emotion || ""
                        } ${isSelected
                            ? "selected"
                            : ""
                        }`}
                    onClick={() =>
                        selectDate(day)
                    }
                >

                    <span className="day-number">
                        {day}
                    </span>


                    {(emotion || data?.emoji) && (

                        <span className="emotion-emoji">

                            {
                                data?.emoji ||
                                emotionInfo[
                                    emotion
                                ]?.emoji ||
                                "🙂"
                            }

                        </span>

                    )}


                    {data?.comment && (

                        <span className="comment-mark">
                            📝
                        </span>

                    )}

                </div>

            );

        }


        return days;
    };


    /* =====================================================
       선택한 날짜 데이터
    ===================================================== */

    const selectedData =
        selectedDate
            ? calendarData[selectedDate]
            : null;


    const hasSavedDiary =
        !!(
            selectedData?.comment ||
            selectedData?.summary
        );


    return (

        <div className="diary-section">

            <div className="section-header">

                <h2>
                    감정 달력
                </h2>

                <p>
                    하루의 감정과 한줄평을
                    기록해보세요.
                </p>

            </div>


            <div className="emotion-calendar-layout">

                {/* =================================================
                   달력
                ================================================= */}

                <div className="calendar-box">

                    <div className="calendar-title">

                        <button
                            type="button"
                            onClick={() =>
                                changeMonth(-1)
                            }
                        >
                            ‹
                        </button>


                        <h3>
                            {year}년 {month + 1}월
                        </h3>


                        <button
                            type="button"
                            onClick={() =>
                                changeMonth(1)
                            }
                        >
                            ›
                        </button>

                    </div>


                    <div className="calendar-week">

                        <span>일</span>
                        <span>월</span>
                        <span>화</span>
                        <span>수</span>
                        <span>목</span>
                        <span>금</span>
                        <span>토</span>

                    </div>


                    <div className="calendar-grid">

                        {renderCalendar()}

                    </div>

                </div>


                {/* =================================================
                   이번 달 감정
                ================================================= */}

                <div className="emotion-summary">

                    <h3>
                        이번 달 감정
                    </h3>


                    {Object.keys(emotionCount)
                        .filter(
                            emotion =>
                                emotionCount[
                                emotion
                                ] > 0
                        )
                        .length === 0 ? (

                        <div className="emotion-summary-empty">

                            <span>
                                📝
                            </span>

                            <p>
                                이번 달에 기록된<br />
                                감정이 없습니다.
                            </p>

                        </div>

                    ) : (

                        <div className="emotion-summary-list">

                            {Object.keys(emotionCount)
                                .filter(
                                    emotion =>
                                        emotionCount[
                                        emotion
                                        ] > 0
                                )
                                .map(
                                    emotion => (

                                        <div
                                            className="emotion-item"
                                            key={emotion}
                                        >

                                            <div className="emotion-item-info">

                                                <span className="emotion-item-emoji">

                                                    {
                                                        emotionInfo[
                                                            emotion
                                                        ]?.emoji
                                                    }

                                                </span>


                                                <span className="emotion-item-name">

                                                    {
                                                        emotionInfo[
                                                            emotion
                                                        ]?.name
                                                    }

                                                </span>

                                            </div>


                                            <strong>

                                                {
                                                    emotionCount[
                                                    emotion
                                                    ]
                                                }
                                                일

                                            </strong>

                                        </div>

                                    )
                                )}

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
               선택 날짜 기록
            ================================================= */}

            {selectedDate && (

                <div className="diary-box">

                    <h3>
                        {selectedDate} 기록
                    </h3>


                    {/* 감정 */}

                    <div className="emotion-select">

                        <p>
                            오늘의 감정
                        </p>


                        <div className="emotion-buttons">

                            {selectedEmotion &&
                                emotionInfo[selectedEmotion] && (

                                    <button
                                        type="button"
                                        className="emotion-active"
                                        disabled={
                                            hasSavedDiary &&
                                            !isEditing
                                        }
                                    >

                                        <span>
                                            {emotionInfo[selectedEmotion].emoji}
                                        </span>

                                        <small>
                                            {emotionInfo[selectedEmotion].name}
                                        </small>

                                    </button>

                                )}

                        </div>

                    </div>


                    {/* 한줄평 */}

                    <div className="comment-area">

                        <p>
                            오늘의 한줄평
                        </p>


                        <textarea
                            value={comment}

                            onChange={e =>
                                setComment(
                                    e.target.value
                                )
                            }

                            placeholder="오늘 하루는 어땠나요?"

                            maxLength={255}

                            readOnly={
                                hasSavedDiary &&
                                !isEditing
                            }
                        />


                    </div>


                    {/* AI 요약 */}

                    {selectedData?.summary && (

                        <div className="diary-summary">

                            <h4>
                                🤖 AI 상담 요약
                            </h4>

                            <p>
                                {selectedData.summary}
                            </p>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}


/* =========================================================
   Diary
========================================================= */

function Diary() {

    const loginUser =
        useSelector(state => state.user);


    /* =====================================================
       화면 메뉴
    ===================================================== */

    const [menu, setMenu] =
        useState("diary");


    /* =====================================================
       현재 달
    ===================================================== */

    const [currentDate, setCurrentDate] =
        useState(new Date());


    /* =====================================================
       선택 날짜
    ===================================================== */

    const [selectedDate, setSelectedDate] =
        useState(null);


    const [selectedEmotion, setSelectedEmotion] =
        useState("");


    const [comment, setComment] =
        useState("");


    const [isEditing, setIsEditing] =
        useState(false);


    /* =====================================================
       일기 상세 모달
    ===================================================== */

    const [selectedDiary, setSelectedDiary] =
        useState(null);


    /* =====================================================
       전체 내 일기

       감정 달력과 분리
    ===================================================== */

    const [myDiaryList, setMyDiaryList] =
        useState([]);


    /* =====================================================
       현재 월 달력 데이터

       예:

       {
           "2026-08-01": {
               emotion: "happy",
               comment: "좋은 하루였다"
           }
       }
    ===================================================== */

    const [calendarData, setCalendarData] =
        useState({});


    const userId =
        loginUser?.userid;


    const nickname =
        loginUser?.nickname ||
        loginUser?.userid ||
        "나";


    /* =========================================================
       1. 내 감정일기 전체 조회
       
       감정일기 메뉴에서 사용
    ========================================================= */

    useEffect(() => {

        if (!userId) {
            return;
        }


        const fetchMyDiary = async () => {

            try {

                const response =
                    await axios.get(
                        `${DIARY_API}/mine/${userId}`
                    );


                console.log(
                    "내 감정일기 조회 결과:",
                    response.data
                );


                let diaryList = [];


                const result =
                    response.data;


                if (Array.isArray(result)) {

                    diaryList = result;

                } else if (
                    Array.isArray(
                        result.diary
                    )
                ) {

                    diaryList =
                        result.diary;

                } else if (
                    Array.isArray(
                        result.list
                    )
                ) {

                    diaryList =
                        result.list;

                } else if (
                    Array.isArray(
                        result.data
                    )
                ) {

                    diaryList =
                        result.data;

                } else if (
                    Array.isArray(
                        result.diaries
                    )
                ) {

                    diaryList =
                        result.diaries;

                } else if (
                    result.diary
                ) {

                    diaryList = [
                        result.diary
                    ];

                }


                const normalizedList =
                    diaryList
                        .filter(Boolean)
                        .map(diary => {

                            const rawDate =
                                diary.diaryDate ||
                                diary.diary_date ||
                                diary.date;


                            const date =
                                formatDiaryDate(
                                    rawDate
                                );


                            let emotion =
                                diary.mood ||
                                diary.emotion ||
                                "";


                            if (
                                !emotionInfo[
                                emotion
                                ]
                            ) {

                                emotion =
                                    moodMap[
                                    emotion
                                    ] || "";

                            }


                            return {

                                diaryId:
                                    diary.id ||
                                    diary.diaryId,

                                userid:
                                    diary.userId ||
                                    diary.user_id ||
                                    userId,

                                nickname:
                                    diary.nickname ||
                                    nickname,

                                date,

                                emotion,

                                comment:
                                    diary.content ||
                                    diary.comment ||
                                    "",

                                summary:
                                    diary.summary ||
                                    "",

                                emoji:
                                    diary.emoji ||
                                    "",

                                isShared:
                                    diary.isShared ??
                                    diary.is_shared ??
                                    false,

                                sessionId:
                                    diary.sessionId ||
                                    diary.session_id ||
                                    null

                            };

                        })
                        .filter(
                            diary =>
                                diary.date
                        );


                normalizedList.sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                );


                setMyDiaryList(
                    normalizedList
                );


            } catch (error) {

                console.error(
                    "내 감정일기 조회 오류:",
                    error
                );

            }

        };


        fetchMyDiary();

    }, [
        userId,
        nickname
    ]);


    /* =========================================================
       2. 해당 월 감정일기 조회
       
       ★ 여기 추가된 핵심 부분
       
       현재 보고 있는 달이 바뀔 때마다 실행됨
    ========================================================= */

    useEffect(() => {

        if (!userId) {
            return;
        }


        const fetchCalendarDiary =
            async () => {

                try {

                    const year =
                        currentDate.getFullYear();

                    const month =
                        currentDate.getMonth();


                    /* -----------------------------------------
                       해당 월 시작일
                    ----------------------------------------- */

                    const startDate =
                        `${year}-${String(
                            month + 1
                        ).padStart(
                            2,
                            "0"
                        )}-01`;


                    /* -----------------------------------------
                       해당 월 마지막 날짜
                    ----------------------------------------- */

                    const lastDay =
                        new Date(
                            year,
                            month + 1,
                            0
                        ).getDate();


                    const endDate =
                        `${year}-${String(
                            month + 1
                        ).padStart(
                            2,
                            "0"
                        )}-${String(
                            lastDay
                        ).padStart(
                            2,
                            "0"
                        )}`;


                    console.log(
                        "달력 조회:",
                        startDate,
                        "~",
                        endDate
                    );


                    /* -----------------------------------------
                       해당 월 데이터 요청
                    ----------------------------------------- */

                    const response =
                        await axios.get(
                            `${DIARY_API}/calendar/${userId}`,
                            {
                                params: {
                                    startDate,
                                    endDate
                                }
                            }
                        );


                    console.log(
                        "해당 월 감정 달력 조회 결과:",
                        response.data
                    );


                    const diaryList =
                        response.data?.diaries ||
                        [];


                    const newCalendarData =
                        {};


                    /* -----------------------------------------
                       서버 데이터 → 달력 데이터 변환
                    ----------------------------------------- */

                    diaryList.forEach(
                        diary => {

                            if (!diary) {
                                return;
                            }


                            const date =
                                formatDiaryDate(
                                    diary.diaryDate ||
                                    diary.diary_date ||
                                    diary.date
                                );


                            if (!date) {
                                return;
                            }


                            let emotion =
                                diary.mood ||
                                diary.emotion ||
                                "";


                            /*
                             * 영어 감정이면 그대로 사용
                             *
                             * happy
                             * calm
                             * sad
                             * anxious
                             * angry
                             */

                            if (
                                !emotionInfo[
                                emotion
                                ]
                            ) {

                                emotion =
                                    moodMap[
                                    emotion
                                    ] || "";

                            }


                            newCalendarData[
                                date
                            ] = {

                                diaryId:
                                    diary.id ||
                                    diary.diaryId,

                                userid:
                                    diary.userId ||
                                    diary.user_id ||
                                    userId,

                                nickname:
                                    diary.nickname ||
                                    nickname,

                                date,

                                emotion,

                                comment:
                                    diary.content ||
                                    diary.comment ||
                                    "",

                                summary:
                                    diary.summary ||
                                    "",

                                emoji:
                                    diary.emoji ||
                                    "",

                                isShared:
                                    diary.isShared ??
                                    diary.is_shared ??
                                    false,

                                sessionId:
                                    diary.sessionId ||
                                    diary.session_id ||
                                    null

                            };

                        }
                    );


                    setCalendarData(
                        newCalendarData
                    );


                } catch (error) {

                    console.error(
                        "감정 달력 조회 실패:",
                        error
                    );


                    setCalendarData({});

                }

            };


        fetchCalendarDiary();

    }, [
        userId,
        currentDate,
        nickname
    ]);


    /* =========================================================
       월 변경
    ========================================================= */

    const changeMonth = (value) => {

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        setCurrentDate(
            new Date(
                year,
                month + value,
                1
            )
        );


        setSelectedDate(null);
        setSelectedEmotion("");
        setComment("");
        setIsEditing(false);

    };


    /* =========================================================
       날짜 선택
    ========================================================= */

    const selectDate = (day) => {

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        const dateKey =
            `${year}-${String(
                month + 1
            ).padStart(
                2,
                "0"
            )}-${String(
                day
            ).padStart(
                2,
                "0"
            )}`;


        const data =
            calendarData[
            dateKey
            ] || {};


        setSelectedDate(
            dateKey
        );


        setSelectedEmotion(
            data.emotion || ""
        );


        setComment(
            data.comment || ""
        );


        setIsEditing(
            !(
                data.comment ||
                data.summary
            )
        );

    };


    /* =========================================================
       일기 저장
    ========================================================= */

    const saveDiary = async () => {

        if (!userId) {

            return alert(
                "로그인이 필요합니다."
            );

        }


        if (!selectedDate) {

            return alert(
                "날짜를 선택해주세요."
            );

        }


        if (!selectedEmotion) {

            return alert(
                "오늘의 감정을 선택해주세요."
            );

        }


        if (!comment.trim()) {

            return alert(
                "한줄평을 입력해주세요."
            );

        }


        try {

            const existingDiary =
                calendarData[
                selectedDate
                ];


            const diaryData = {

                id:
                    existingDiary?.diaryId ||
                    null,

                userId:
                    userId,

                diaryDate:
                    selectedDate,

                mood:
                    selectedEmotion,

                summary:
                    existingDiary?.summary ||
                    "",

                isShared:
                    existingDiary?.isShared ??
                    false,

                sessionId:
                    existingDiary?.sessionId ||
                    null,

                content:
                    comment.trim()

            };


            console.log(
                "감정일기 저장 요청:",
                diaryData
            );


            const response =
                await axios.post(
                    DIARY_API,
                    diaryData
                );


            console.log(
                "감정일기 저장 결과:",
                response.data
            );


            const savedDiary =
                response.data?.diary ||
                response.data;


            const savedDate =
                formatDiaryDate(
                    savedDiary?.diaryDate ||
                    savedDiary?.diary_date ||
                    savedDiary?.date ||
                    selectedDate
                );


            let savedEmotion =
                savedDiary?.mood ||
                savedDiary?.emotion ||
                selectedEmotion;


            if (
                !emotionInfo[
                savedEmotion
                ]
            ) {

                savedEmotion =
                    moodMap[
                    savedEmotion
                    ] || selectedEmotion;

            }


            const savedContent =
                savedDiary?.content ||
                savedDiary?.comment ||
                comment.trim();


            const newDiary = {

                diaryId:
                    savedDiary?.id ||
                    savedDiary?.diaryId ||
                    existingDiary?.diaryId ||
                    null,

                userid:
                    savedDiary?.userId ||
                    savedDiary?.user_id ||
                    userId,

                nickname:
                    savedDiary?.nickname ||
                    nickname,

                date:
                    savedDate,

                emotion:
                    savedEmotion,

                comment:
                    savedContent,

                summary:
                    savedDiary?.summary ||
                    existingDiary?.summary ||
                    "",

                emoji:
                    savedDiary?.emoji ||
                    "",

                isShared:
                    savedDiary?.isShared ??
                    savedDiary?.is_shared ??
                    existingDiary?.isShared ??
                    false,

                sessionId:
                    savedDiary?.sessionId ||
                    savedDiary?.session_id ||
                    existingDiary?.sessionId ||
                    null

            };


            /* -----------------------------------------
               달력 데이터 즉시 반영
            ----------------------------------------- */

            setCalendarData(
                prev => ({
                    ...prev,
                    [savedDate]:
                        newDiary
                })
            );


            /* -----------------------------------------
               내 일기 목록에도 즉시 반영
            ----------------------------------------- */

            setMyDiaryList(
                prev => {

                    const filtered =
                        prev.filter(
                            diary =>
                                diary.date !==
                                savedDate
                        );


                    return [
                        newDiary,
                        ...filtered
                    ].sort(
                        (a, b) =>
                            new Date(b.date) -
                            new Date(a.date)
                    );

                }
            );


            setIsEditing(false);


            alert(
                "감정일기가 저장되었습니다."
            );


        } catch (error) {

            console.error(
                "감정일기 저장 오류:",
                error
            );


            alert(
                "감정일기 저장 중 오류가 발생했습니다."
            );

        }

    };


    /* =========================================================
       현재 월
    ========================================================= */

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    /* =========================================================
       현재 월 감정 개수
       
       calendarData 자체가 현재 월 데이터이므로
       별도 날짜 필터링 필요 없음
    ========================================================= */

    const emotionCount = {

        happy: 0,

        calm: 0,

        sad: 0,

        anxious: 0,

        angry: 0

    };


    Object.values(
        calendarData
    ).forEach(
        data => {

            const emotion =
                data?.emotion;


            if (
                emotion &&
                emotionCount[
                emotion
                ] !== undefined
            ) {

                emotionCount[
                    emotion
                ]++;

            }

        }
    );


    /* =========================================================
       화면
    ========================================================= */

    return (

        <div className="diary">

            {/* =================================================
               헤더
            ================================================= */}

            <div className="diary-header">

                <h1>
                    My Diary
                </h1>

                <p>
                    나의 감정과 이야기를
                    관리해보세요.
                </p>

            </div>


            <div className="diary-container">

                {/* =================================================
                   사이드바
                ================================================= */}

                <aside className="diary-sidebar">

                    <div className="sidebar-profile">

                        <div className="sidebar-profile-image">
                            👤
                        </div>


                        <div className="sidebar-profile-info">

                            <strong>

                                {
                                    loginUser?.nickname ||
                                    loginUser?.userid ||
                                    "로그인 필요"
                                }

                            </strong>

                        </div>

                    </div>


                    <div className="sidebar-menu">

                        <button
                            type="button"
                            className={
                                menu === "diary"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setMenu("diary")
                            }
                        >

                            <span>
                                📖
                            </span>

                            감정일기

                        </button>


                        <button
                            type="button"
                            className={
                                menu === "emotion"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setMenu("emotion")
                            }
                        >

                            <span>
                                📅
                            </span>

                            감정 달력

                        </button>

                    </div>

                </aside>


                {/* =================================================
                   메인
                ================================================= */}

                <main className="diary-content">

                    {menu === "diary" && (

                        <EmotionDiary

                            diaryList={
                                myDiaryList
                            }

                            setSelectedDiary={
                                setSelectedDiary
                            }

                            selectedDiary={
                                selectedDiary
                            }

                        />

                    )}


                    {menu === "emotion" && (

                        <EmotionCalendar

                            currentDate={
                                currentDate
                            }

                            changeMonth={
                                changeMonth
                            }

                            selectedDate={
                                selectedDate
                            }

                            selectDate={
                                selectDate
                            }

                            selectedEmotion={
                                selectedEmotion
                            }

                            setSelectedEmotion={
                                setSelectedEmotion
                            }

                            comment={
                                comment
                            }

                            setComment={
                                setComment
                            }

                            saveDiary={
                                saveDiary
                            }

                            calendarData={
                                calendarData
                            }

                            emotionCount={
                                emotionCount
                            }

                            isEditing={
                                isEditing
                            }

                            setIsEditing={
                                setIsEditing
                            }

                        />

                    )}

                </main>

            </div>

        </div>
    );
}


export default Diary;