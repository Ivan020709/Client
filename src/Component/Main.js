import React, { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner1 from '../Img/banner.png';
import banner2 from '../Img/banner2.png';
import banner3 from '../Img/banner3.png';
import banner4 from '../Img/banner4.png';
import '../style/main.css';

function Main() {

    const navigate = useNavigate();
    const settings = {dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000, arrows: true };
    /* ================================
       오늘의 기분
    ================================= */
    const [todayMood, setTodayMood] = useState(null);
    const moods = [{emoji: '😊', name: '좋아요'}, {emoji: '🙂', name: '괜찮아요'}, {emoji: '😐', name: '그저 그래요'}, {emoji: '😔', name: '우울해요'}, {emoji: '😣', name: '힘들어요'}];
    /* ================================
       최근 고민 게시글
       나중에 axios 연결
    ================================= */
    const [recentPosts/*, setRecentPosts*/] = useState([]);

    return (
        <div className="main-page">
            {/* ================================
                메인 배너
            ================================= */}
            <div className="main-banner">
                <Slider {...settings}>
                    <div><img src={banner1} alt="메인 배너 1"/></div>
                    <div><img src={banner2} alt="메인 배너 2"/></div>
                    <div><img src={banner3} alt="메인 배너 3"/></div>
                    <div><img src={banner4} alt="메인 배너 4"/></div>
                </Slider>
            </div>
            {/* ================================
                메인 컨텐츠
            ================================= */}
            <div className="main-content">
                {/* ================================
                    CONTENT 1
                    오늘의 기분
                ================================= */}
                <div className="main-content-box mood-box">
                    <div className="content-title-area">
                        <div>
                            <h2>오늘의 기분</h2>
                            <p>오늘 하루는 어떤 기분인가요?</p>
                        </div>
                        <span className="content-icon">🌿</span>
                    </div>
                    {/* 기분 선택 */}
                    <div className="mood-list">
                        {moods.map((mood) => (
                            <button key={mood.name} className={ todayMood === mood.name ? 'mood-item active' : 'mood-item'} onClick={() => setTodayMood(mood.name)}>
                                <span className="mood-emoji">{mood.emoji}</span>
                                <span className="mood-name">{mood.name}</span>
                            </button>
                        ))}
                    </div>
                    {/* 선택 결과 */}
                    <div className="mood-result">{todayMood ? (<>오늘은 <strong>{todayMood}</strong> 기분이군요.<br />당신의 이야기를 AI에게 들려주세요.</>) : (<>오늘의 기분을 기록해보세요.</>)}</div>
                    <button className="main-action-btn" onClick={() => navigate('/chat')}>AI 상담 시작하기 →</button>
                </div>
                {/* ================================
                    CONTENT 2
                    이번 달 AI 랭킹 1위
                ================================= */}
                <div className="main-content-box ranking-box">
                    <div className="content-title-area">
                        <div>
                            <h2>이번 달 AI 랭킹 1위</h2>
                            <p>가장 높은 레벨을 달성한 유저는?</p>
                        </div>
                        <span className="content-icon">🏆</span>
                    </div>
                    <div className="ranking-top">
                        <div className="ranking-crown">🥇</div>
                        <div className="ranking-user-name">행복한사람</div>{/* 더미데이터라서 나중에 수정 예정 */}
                        <div className="ranking-model-name">🌿 따뜻한 AI</div>{/* 더미데이터라서 나중에 수정 예정 */}
                        <div className="ranking-level">Lv.21</div>{/* 더미데이터라서 나중에 수정 예정 */}
                    </div>
                    <button className="main-action-btn" onClick={() => navigate('/ranking')}>전체 랭킹 보기 →</button>
                </div>
                {/* ================================
                    CONTENT 3
                    최근 고민 이야기
                ================================= */}
                <div className="main-content-box board-box">
                    <div className="content-title-area">
                        <div>
                            <h2>최근 고민 이야기</h2>
                            <p>다른 사람들의 고민을 살펴보세요.</p>
                        </div>
                        <button className="more-btn" onClick={() => navigate('/boardList')}>더보기 →</button>
                    </div>
                    <div className="recent-post-list">
                        {recentPosts.length > 0 ? (
                            recentPosts.map((post) => (
                                <div className="recent-post" key={post.boardnum} onClick={() => navigate(`/boardView/${post.boardnum}`)}>
                                    {/* <span className="post-category">{post.category}</span> */}
                                    <span className="post-title">{post.title}</span>
                                    <span className="post-date">{post.date}</span>
                                </div>
                            ))
                        ) : (<div className="no-recent-post">아직 등록된 게시글이 없습니다.</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;