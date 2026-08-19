import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Main/Main.css';

export default function DiaryList() {
    const [diaries, setDiaries] = useState([]);
    useEffect(() => { axios.get('/api/diary/shared').then((result) => setDiaries(result.data.diaries || [])).catch(console.error); }, []);
    return <main className="main-page"><section className="shared-diary-section"><div className="shared-diary-heading"><div><p className="shared-diary-eyebrow">SHARED EMOTION DIARY</p><h2>공유 감정일기</h2><p>AI 상담 뒤 남겨진 따뜻한 마음의 기록입니다.</p></div></div><div className="shared-diary-list">{diaries.length === 0 ? <p className="shared-diary-empty">아직 공유된 감정일기가 없습니다.</p> : diaries.map((diary) => <article className="shared-diary-card" key={diary.id}><div className="shared-diary-card-top"><span className="shared-diary-date">{diary.diaryDate}</span><span className="shared-diary-mood">{diary.mood}</span></div><h3>{diary.title}</h3><p>{diary.summary}</p></article>)}</div></section></main>;
}
