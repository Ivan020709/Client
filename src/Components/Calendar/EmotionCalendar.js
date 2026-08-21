import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';

import "./Diary.css";

const DIARY_API = "/api/diary";

const emotionInfo = {
    happy: { emoji: "😊", name: "행복" },
    calm: { emoji: "😌", name: "편안" },
    sad: { emoji: "😔", name: "우울" },
    anxious: { emoji: "😰", name: "불안" },
    angry: { emoji: "😡", name: "화남" }
};

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

const formatDiaryDate = value => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/* =========================
   감정 달력
========================= */

function EmotionCalendar() {

    const loginUser = useSelector(state => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const [menu, setMenu] = useState("emotion");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEmotion, setSelectedEmotion] = useState("");
    const [comment, setComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const userId = loginUser?.userid || "guest";
    const nickname =
        loginUser?.nickname ||
        loginUser?.userid ||
        "익명";

    const [emotionData, setEmotionData] = useState({});

    useEffect(() => {

        if (!loginUser?.userid) {
            return;
        }

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const startDate =
            `${year}-${String(month + 1).padStart(2, "0")}-01`;

        const lastDay =
            new Date(year, month + 1, 0).getDate();

        const endDate =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

        axios.get(
            `${DIARY_API}/calendar/${loginUser.userid}`,
            {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            }
        )
            .then((result) => {

                const diaryList = result.data.diaries || [];
                const calendarData = {};

                diaryList.forEach((diary) => {

                    let emotion = diary.mood;

                    if (!emotionInfo[emotion]) {
                        emotion = moodMap[diary.mood];
                    }

                    const diaryDate = formatDiaryDate(diary.diaryDate);

                    calendarData[diaryDate] = {
                        emotion: emotion,
                        comment: diary.content || diary.summary,
                        userid: diary.userId,
                        date: diaryDate,
                        emoji: diary.emoji
                    };
                });

                setEmotionData(calendarData);
            })
            .catch((err) => {
                console.error(err);
                alert("감정달력을 불러오지 못했습니다.");
            });

    }, [loginUser?.userid, currentDate]);

    const changeMonth = value => {

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        setCurrentDate(
            new Date(year, month + value, 1)
        );

        setSelectedDate(null);
        setSelectedEmotion("");
        setComment("");
        setIsEditing(false);
    };

    const selectDate = day => {

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const dateKey =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const data =
            emotionData[dateKey] || {};

        setSelectedDate(dateKey);
        setSelectedEmotion(data.emotion || "");
        setComment(data.comment || "");
        setIsEditing(!data.comment);
    };

    const saveDiary = () => {

        if (!selectedDate) {
            return alert("날짜를 선택해주세요.");
        }

        if (!selectedEmotion) {
            return alert("오늘의 감정을 선택해주세요.");
        }

        if (!comment.trim()) {
            return alert("한줄평을 입력해주세요.");
        }

        const newData = {
            ...emotionData,
            [selectedDate]: {
                emotion: selectedEmotion,
                comment: comment.trim(),
                userid: userId,
                nickname: nickname,
                date: selectedDate
            }
        };

        setEmotionData(newData);
        setIsEditing(false);

        alert("감정일기가 저장되었습니다.");
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const currentMonthData =
        Object.entries(emotionData)
            .filter(([date]) =>
                date.startsWith(
                    `${year}-${String(month + 1).padStart(2, "0")}`
                )
            );

    const emotionCount = {
        happy: 0,
        calm: 0,
        sad: 0,
        anxious: 0,
        angry: 0
    };

    currentMonthData.forEach(([date, data]) => {

        if (
            data.emotion &&
            emotionCount[data.emotion] !== undefined
        ) {
            emotionCount[data.emotion]++;
        }

    });

    const firstDay =
        new Date(year, month, 1).getDay();

    const lastDate =
        new Date(year, month + 1, 0).getDate();

    const renderCalendar = () => {

        const days = [];

        for (let i = 0; i < firstDay; i++) {

            days.push(
                <div
                    key={`empty-${i}`}
                    className="calendar-day empty"
                />
            );

        }

        for (let day = 1; day <= lastDate; day++) {

            const dateKey =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const data =
                emotionData[dateKey];

            const emotion =
                data?.emotion;

            const isSelected =
                selectedDate === dateKey;

            days.push(

                <div
                    key={day}
                    className={
                        `calendar-day ${emotion || ""} ${isSelected ? "selected" : ""}`
                    }
                    onClick={() =>
                        selectDate(day)
                    }
                >

                    <span className="day-number">
                        {day}
                    </span>

                    {(emotion || data?.emoji) && (
                        <span className="emotion-emoji">
                            {data?.emoji || emotionInfo[emotion]?.emoji}
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

    const hasSavedDiary =
        selectedDate &&
        emotionData[selectedDate]?.comment;

    return (

        <div className="diary">

            <div className="diary-header">
                <h1>My Diary</h1>
                <p>
                    나의 감정과 이야기를 관리해보세요.
                </p>
            </div>

            <div className="diary-container">

                <aside className="diary-sidebar">

                    <div className="sidebar-profile">

                        <div className="sidebar-profile-image">
                            👤
                        </div>

                        <div className="sidebar-profile-info">
                            <strong>
                                {loginUser?.nickname ||
                                    loginUser?.userid ||
                                    "로그인 필요"}
                            </strong>
                        </div>

                    </div>

                    <div className="sidebar-menu">

                        <button
                            type="button"
                            className={location.pathname === "/emotionDiary" ? "active" : ""}
                            onClick={() => navigate("/emotionDiary")}
                        >
                            <span>📖</span>
                            감정일기
                        </button>

                        <button
                            type="button"
                            className={location.pathname === "/emotionCalendar" ? "active" : ""}
                            onClick={() => navigate("/emotionCalendar")}
                        >
                            <span>📅</span>
                            감정 달력
                        </button>

                    </div>

                </aside>

                <main className="diary-content">

                    <div className="diary-section">

                        <div className="section-header">
                            <h2>감정 달력</h2>
                            <p>
                                하루의 감정과 한줄평을 기록해보세요.
                            </p>
                        </div>

                        <div className="emotion-calendar-layout">

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

                            <div className="emotion-summary">

                                <h3>이번 달 감정</h3>

                                <div className="emotion-item">
                                    <span>😊 행복</span>
                                    <strong>
                                        {emotionCount.happy}일
                                    </strong>
                                </div>

                                <div className="emotion-item">
                                    <span>😌 편안</span>
                                    <strong>
                                        {emotionCount.calm}일
                                    </strong>
                                </div>

                                <div className="emotion-item">
                                    <span>😔 우울</span>
                                    <strong>
                                        {emotionCount.sad}일
                                    </strong>
                                </div>

                                <div className="emotion-item">
                                    <span>😰 불안</span>
                                    <strong>
                                        {emotionCount.anxious}일
                                    </strong>
                                </div>

                                <div className="emotion-item">
                                    <span>😡 화남</span>
                                    <strong>
                                        {emotionCount.angry}일
                                    </strong>
                                </div>

                            </div>

                        </div>



                    </div>

                </main>

            </div>

        </div>
    );
}

export default EmotionCalendar;
