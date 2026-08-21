import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./Diary.css";


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

const formatDiaryDate = value => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};


/* =========================
   감정일기 목록
========================= */

function EmotionDiary({
    diaryList,
    setSelectedDiary,
    selectedDiary
}) {

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


            {/* =========================
               일기 상세 모달
            ========================= */}

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


                        {/* =========================
                           AI 요약
                        ========================= */}

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


                        {/* =========================
                           일기 내용
                        ========================= */}

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


/* =========================
   게시판 메모지
========================= */

function DiaryMemo({
    diary,
    index,
    onClick
}) {

    const emotion =
        emotionInfo[diary.emotion] || {};


    /*
     * 목록에서는 AI 요약을 우선 표시
     * summary가 없으면 content 표시
     */

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


/* =========================
   감정 달력
========================= */

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
    emotionData,
    emotionCount,
    isEditing,
    setIsEditing
}) {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


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


    /* =========================
       달력 생성
    ========================= */

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
                emotionData[dateKey];


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


    const selectedData =
        selectedDate
            ? emotionData[selectedDate]
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

                {/* =========================
                   달력
                ========================= */}

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


                {/* =========================
                   이번 달 감정
                ========================= */}

                <div className="emotion-summary">

                    <h3>
                        이번 달 감정
                    </h3>


                    <div className="emotion-item">

                        <span>
                            😊 행복
                        </span>

                        <strong>
                            {emotionCount.happy}일
                        </strong>

                    </div>


                    <div className="emotion-item">

                        <span>
                            😌 편안
                        </span>

                        <strong>
                            {emotionCount.calm}일
                        </strong>

                    </div>


                    <div className="emotion-item">

                        <span>
                            😔 우울
                        </span>

                        <strong>
                            {emotionCount.sad}일
                        </strong>

                    </div>


                    <div className="emotion-item">

                        <span>
                            😰 불안
                        </span>

                        <strong>
                            {emotionCount.anxious}일
                        </strong>

                    </div>


                    <div className="emotion-item">

                        <span>
                            😡 화남
                        </span>

                        <strong>
                            {emotionCount.angry}일
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================
               날짜 기록
            ========================= */}

            {selectedDate && (

                <div className="diary-box">

                    <h3>
                        {selectedDate} 기록
                    </h3>


                    {/* =========================
                       감정 선택
                    ========================= */}

                    <div className="emotion-select">

                        <p>
                            오늘의 감정
                        </p>


                        <div className="emotion-buttons">

                            {Object.entries(
                                emotionInfo
                            ).map(
                                ([key, value]) => (

                                    <button
                                        key={key}
                                        type="button"

                                        disabled={
                                            hasSavedDiary &&
                                            !isEditing
                                        }

                                        className={
                                            selectedEmotion ===
                                                key
                                                ? "emotion-active"
                                                : ""
                                        }

                                        onClick={() =>
                                            setSelectedEmotion(
                                                key
                                            )
                                        }
                                    >

                                        <span>
                                            {value.emoji}
                                        </span>

                                        <small>
                                            {value.name}
                                        </small>

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* =========================
                       내용
                    ========================= */}

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


                        <div className="comment-bottom">

                            <span>
                                {comment.length}/255
                            </span>


                            {hasSavedDiary &&
                                !isEditing ? (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsEditing(
                                            true
                                        )
                                    }
                                >
                                    수정
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    onClick={saveDiary}
                                >
                                    저장
                                </button>

                            )}

                        </div>

                    </div>


                    {/* =========================
                       AI 요약
                    ========================= */}

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


/* =========================
   Diary
========================= */

function Diary() {

    const loginUser =
        useSelector(state => state.user);


    const [menu, setMenu] =
        useState("diary");


    const [currentDate, setCurrentDate] =
        useState(new Date());


    const [selectedDate, setSelectedDate] =
        useState(null);


    const [selectedEmotion, setSelectedEmotion] =
        useState("");


    const [comment, setComment] =
        useState("");


    const [selectedDiary, setSelectedDiary] =
        useState(null);


    const [isEditing, setIsEditing] =
        useState(false);


    const [emotionData, setEmotionData] =
        useState({});


    const userId =
        loginUser?.userid;


    const nickname =
        loginUser?.nickname ||
        loginUser?.userid ||
        "나";


    /* =========================
       내 감정일기 조회
    ========================= */

    useEffect(() => {

        if (!userId) {
            return;
        }


        const fetchDiary = async () => {

            try {

                const response =
                    await fetch(
                        `api/diary/mine/${userId}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "감정일기 조회 실패"
                    );

                }


                const result =
                    await response.json();


                console.log(
                    "감정일기 조회 결과:",
                    result
                );


                /*
                 * EmotionDiaryService의
                 * 반환 형태에 대응
                 */

                let diaryList = [];


                if (Array.isArray(result)) {

                    diaryList =
                        result;

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
                    result.diary
                ) {

                    diaryList = [
                        result.diary
                    ];

                }


                const diaryMap = {};


                diaryList.forEach(
                    diary => {

                        if (!diary) {
                            return;
                        }


                        /*
                         * 서버 DB 컬럼명과
                         * 프론트에서 사용하는 이름을
                         * 여기서 통일
                         */

                        const rawDate =
                            diary.diaryDate ||
                            diary.diary_date ||
                            diary.date;


                        if (!rawDate) {
                            return;
                        }


                        const date =
                            formatDiaryDate(rawDate);


                        const emotion =
                            diary.mood ||
                            diary.emotion ||
                            "";


                        const content =
                            diary.content ||
                            diary.comment ||
                            "";


                        diaryMap[date] = {

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
                                content,

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


                setEmotionData(
                    diaryMap
                );

            } catch (error) {

                console.error(
                    "감정일기 조회 오류:",
                    error
                );

            }

        };


        fetchDiary();

    }, [
        userId,
        nickname
    ]);


    /* =========================
       월 변경
    ========================= */

    const changeMonth = value => {

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


    /* =========================
       날짜 선택
    ========================= */

    const selectDate = day => {

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        const dateKey =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        const data =
            emotionData[dateKey] || {};


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


    /* =========================
       일기 저장
    ========================= */

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
                emotionData[
                selectedDate
                ];


            /*
             * 현재 서버의 EmotionDiary
             * 엔티티가 받는 필드 기준
             */

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
                "일기 저장 요청:",
                diaryData
            );


            const response =
                await fetch(
                    "http://localhost:8080/diary",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                diaryData
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "감정일기 저장 실패"
                );

            }


            const result =
                await response.json();


            console.log(
                "일기 저장 결과:",
                result
            );


            /*
             * 서버가 저장한 데이터
             */

            const savedDiary =
                result.diary ||
                result;


            const savedDate =
                savedDiary.diaryDate ||
                savedDiary.diary_date ||
                savedDiary.date ||
                selectedDate;


            const savedEmotion =
                savedDiary.mood ||
                savedDiary.emotion ||
                selectedEmotion;


            const savedContent =
                savedDiary.content ||
                savedDiary.comment ||
                comment.trim();


            const newDiary = {

                diaryId:
                    savedDiary.id ||
                    savedDiary.diaryId ||
                    existingDiary?.diaryId,

                userid:
                    savedDiary.userId ||
                    savedDiary.user_id ||
                    userId,

                nickname:
                    savedDiary.nickname ||
                    nickname,

                date:
                    savedDate,

                emotion:
                    savedEmotion,

                comment:
                    savedContent,

                summary:
                    savedDiary.summary ||
                    existingDiary?.summary ||
                    "",

                isShared:
                    savedDiary.isShared ??
                    savedDiary.is_shared ??
                    existingDiary?.isShared ??
                    false,

                sessionId:
                    savedDiary.sessionId ||
                    savedDiary.session_id ||
                    existingDiary?.sessionId ||
                    null

            };


            setEmotionData(prev => ({

                ...prev,

                [savedDate]:
                    newDiary

            }));


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


    /* =========================
       내 일기 목록
    ========================= */

    const myDiaryList =
        Object.entries(
            emotionData
        )

            .filter(
                ([date, data]) =>
                    data?.comment ||
                    data?.summary
            )

            .map(
                ([date, data]) => ({

                    diaryId:
                        data.diaryId,

                    date,

                    userid:
                        data.userid ||
                        userId,

                    nickname:
                        data.nickname ||
                        nickname,

                    emotion:
                        data.emotion,

                    comment:
                        data.comment,

                    summary:
                        data.summary,

                    isShared:
                        data.isShared,

                    sessionId:
                        data.sessionId

                })
            )

            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    /* =========================
       현재 월 감정
    ========================= */

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const currentMonthData =
        Object.entries(
            emotionData
        ).filter(
            ([date]) =>
                date.startsWith(
                    `${year}-${String(
                        month + 1
                    ).padStart(2, "0")}`
                )
        );


    const emotionCount = {

        happy: 0,

        calm: 0,

        sad: 0,

        anxious: 0,

        angry: 0

    };


    currentMonthData.forEach(
        ([date, data]) => {

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


    /* =========================
       화면
    ========================= */

    return (

        <div className="diary">

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

                {/* =========================
                   사이드바
                ========================= */}

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
                                setMenu(
                                    "diary"
                                )
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
                                setMenu(
                                    "emotion"
                                )
                            }
                        >

                            <span>
                                📅
                            </span>

                            감정 달력

                        </button>

                    </div>

                </aside>


                {/* =========================
                   메인
                ========================= */}

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

                            emotionData={
                                emotionData
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
