import React, { useState } from "react";
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

/* =========================
   일기장 카드
========================= */

function DiaryCard({ diary, onClick }) {
    return (
        <div className="diary-cover" onClick={onClick}>
            <div className="diary-book">
                <div className="diary-book-binding"></div>
                <div className="diary-book-icon">🖋️</div>
                <div className="diary-book-title">감정일기</div>
                <div className="diary-book-date">{diary.date}</div>
                <div className="diary-book-writer">{diary.nickname}</div>
                <div className="diary-book-hint">CLICK TO OPEN</div>
            </div>
        </div>
    );
}

/* =========================
   감정일기
========================= */

function EmotionDiary() {

    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [menu, setMenu] = useState("diary");
    const [diaryTab, setDiaryTab] = useState("my");
    const [selectedDiary, setSelectedDiary] = useState(null);

    const userId = loginUser?.userid || "guest";
    const nickname = loginUser?.nickname || loginUser?.userid || "익명";

    const [emotionData, setEmotionData] = useState({});

    const myDiaryList = Object.entries(emotionData)
        .filter(([date, data]) => data?.comment)
        .map(([date, data]) => ({
            date,
            userid: data.userid || userId,
            nickname: data.nickname || nickname,
            emotion: data.emotion,
            comment: data.comment
        }))
        .sort(
            (a, b) =>
                new Date(b.date) - new Date(a.date)
        );

    const communityDiaryList = [
        {
            diaryId: 1,
            userid: "user01",
            nickname: "민수",
            date: "2026-08-18",
            emotion: "happy",
            comment: "오늘은 기분 좋은 일이 많았다."
        },
        {
            diaryId: 2,
            userid: "user02",
            nickname: "지민",
            date: "2026-08-17",
            emotion: "calm",
            comment: "오랜만에 여유로운 하루였다."
        },
        {
            diaryId: 3,
            userid: "user03",
            nickname: "서연",
            date: "2026-08-16",
            emotion: "sad",
            comment: "조금 힘든 하루였지만 잘 이겨냈다."
        }
    ].sort(
        (a, b) =>
            new Date(b.date) - new Date(a.date)
    );

    const diaryList =
        diaryTab === "my"
            ? myDiaryList
            : communityDiaryList;

    return (
        <div className="diary">

            <div className="diary-header">
                <h1>My Diary</h1>
                <p>나의 감정과 이야기를 관리해보세요.</p>
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
                            <h2>감정일기</h2>
                            <p>
                                나의 하루와 다른 사람들의 이야기를 함께 확인해보세요.
                            </p>
                        </div>

                        <div className="diary-tabs">

                            <button
                                type="button"
                                className={
                                    diaryTab === "my"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setDiaryTab("my")
                                }
                            >
                                내 일기
                            </button>

                            <button
                                type="button"
                                className={
                                    diaryTab === "community"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setDiaryTab("community")
                                }
                            >
                                다른 사람들의 일기
                            </button>

                        </div>

                        {diaryList.length === 0 ? (

                            <div className="empty-diary">
                                <div>📖</div>

                                <p>
                                    {diaryTab === "my"
                                        ? "작성한 감정일기가 없습니다."
                                        : "아직 다른 사람들의 일기가 없습니다."}
                                </p>

                                <span>
                                    {diaryTab === "my"
                                        ? "감정 달력에서 하루의 감정을 기록해보세요."
                                        : "조금만 기다려주세요."}
                                </span>
                            </div>

                        ) : (

                            <div className="diary-note-list">

                                {diaryList.map((diary, index) => (

                                    <DiaryCard
                                        key={
                                            diary.diaryId ||
                                            diary.date ||
                                            index
                                        }
                                        diary={diary}
                                        onClick={() =>
                                            setSelectedDiary(diary)
                                        }
                                    />

                                ))}

                            </div>

                        )}

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
                                        📖
                                    </div>

                                    <div className="diary-modal-header">

                                        <div>
                                            <h3>
                                                {selectedDiary.nickname}
                                                님의 감정일기
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
                                                    ]?.name || "기록"
                                                }
                                            </small>

                                        </div>

                                    </div>

                                    <div className="diary-modal-content">
                                        {selectedDiary.comment}
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

                </main>

            </div>

        </div>
    );
}

export default EmotionDiary;