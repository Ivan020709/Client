import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../style/Main.css';

function Main() {

    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    /* ================================
       오늘의 기분
    ================================= */
    const [todayMood, setTodayMood] = useState(null);
    const moods = [{ emoji: '😊', name: '좋아요' }, { emoji: '🙂', name: '괜찮아요' }, { emoji: '😐', name: '그저 그래요' }, { emoji: '😔', name: '우울해요' }, { emoji: '😣', name: '힘들어요' }];
    /* 기존 최근 고민 이야기 카드용 상태 */
    const [recentPosts/*, setRecentPosts*/] = useState([]);

    /* ================================
       유선 노트 배너 게시글
    ================================= */
    const [bannerPosts, setBannerPosts] = useState([]);
    const [sharedDiaries, setSharedDiaries] = useState([]);
    const [reportTarget, setReportTarget] = useState(null);
    const [reportReason, setReportReason] = useState('부적절한 내용');
    const [reportDetail, setReportDetail] = useState('');
    const memoColors = ['#ffdede', '#fff4b8', '#dff1ff', '#e7ddff', '#dff5df', '#ffe8c9'];

    useEffect(() => {
        const getBannerPosts = async () => {
            try {
                const userId = loginUser?.userid;
                const firstPageResult = await axios.get('/api/board/getBoardList/1', { params: userId ? { userId } : {} });
                const firstPagePosts = firstPageResult.data.boardList || [];
                const totalPages = Math.ceil((firstPageResult.data.paging?.totalCount || 0) / 5);

                const otherPageResults = await Promise.all(
                    Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) =>
                        axios.get(`/api/board/getBoardList/${index + 2}`, { params: userId ? { userId } : {} })
                    )
                );
                const allPosts = [
                    ...firstPagePosts,
                    ...otherPageResults.flatMap((result) => result.data.boardList || [])
                ];
                const shuffledColors = [...memoColors].sort(() => Math.random() - 0.5);

                const shuffledPosts = [...allPosts]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4)
                    .map((post, index) => ({
                        ...post,
                        memoColor: shuffledColors[index % shuffledColors.length],
                        memoRotation: `${Math.floor(Math.random() * 7) - 3}deg`
                    }));

                setBannerPosts(shuffledPosts);
            } catch (err) {
                console.error('배너 게시글 조회 실패:', err);
            }
        };

        getBannerPosts();
    }, [loginUser]);

    useEffect(() => {
        axios.get('/api/diary/shared')
            .then((result) => setSharedDiaries(result.data.diaries || []))
            .catch((error) => console.error('공유 감정일기 조회 실패:', error));
    }, []);

    const handleBannerPostClick = (boardnum) => {
        axios.post('/api/board/plusCount', null, { params: { boardnum } })
            .then(() => navigate(`/boardView/${boardnum}`))
            .catch((err) => console.error('게시글 조회수 증가 실패:', err));
    };

    const handleLike = async (event, post) => {
        event.stopPropagation();

        if (!loginUser?.userid) {
            alert('좋아요는 로그인 후 이용할 수 있습니다.');
            return;
        }

        try {
            const result = await axios.post('/api/board/toggleLike', null, {
                params: { boardId: post.boardnum, userId: loginUser.userid }
            });
            const liked = result.data.liked ?? !post.liked;
            const likeCount = result.data.likeCount ?? Math.max(0, (post.likeCount || 0) + (liked ? 1 : -1));

            setBannerPosts((posts) => posts.map((item) => (
                item.boardnum === post.boardnum ? { ...item, liked, likeCount } : item
            )));
        } catch (err) {
            console.error('좋아요 처리 실패:', err);
            alert('좋아요 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const openReportModal = (event, post) => {
        event.stopPropagation();

        if (!loginUser?.userid) {
            alert('신고는 로그인 후 이용할 수 있습니다.');
            return;
        }

        setReportTarget(post);
        setReportReason('부적절한 내용');
        setReportDetail('');
    };

    const handleReportSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('/api/board/reportBoard', {
                boardId: reportTarget.boardnum,
                reporterId: loginUser.userid,
                reason: reportReason,
                detail: reportDetail.trim()
            });
            alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
            setReportTarget(null);
        } catch (err) {
            console.error('신고 접수 실패:', err);
            alert('신고 접수에 실패했습니다. 이미 신고한 게시글인지 확인해주세요.');
        }
    };

    return (
        <div className="main-page">
            {/* ================================
                유선 노트 배너
            ================================= */}
            <section className="notebook-banner">
                <div className="notebook-memo-list" aria-label="추천 고민 게시글">
                    {bannerPosts.map((post) => (
                        <div
                            className="notebook-memo"
                            key={post.boardnum}
                            style={{ '--memo-color': post.memoColor, '--memo-rotation': post.memoRotation }}
                            onClick={() => handleBannerPostClick(post.boardnum)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    handleBannerPostClick(post.boardnum);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`${post.title} 게시글 보러가기`}
                        >
                            <div className="notebook-memo-heading">
                                <strong className="notebook-memo-title">{post.title}</strong>
                                <span className="notebook-memo-category">#{post.category || '고민'}</span>
                            </div>
                            <p className="notebook-memo-content">{post.content}</p>
                            <span className="notebook-memo-arrow" aria-hidden="true">→</span>
                            <span className="notebook-memo-actions">
                                <button
                                    type="button"
                                    className={`notebook-memo-like${post.liked ? ' is-liked' : ''}`}
                                    onClick={(event) => handleLike(event, post)}
                                    aria-label={`${post.title} 좋아요`}
                                >
                                    ♥ <span>{post.likeCount || 0}</span>
                                </button>
                                <button
                                    type="button"
                                    className="notebook-memo-report"
                                    onClick={(event) => openReportModal(event, post)}
                                    aria-label={`${post.title} 신고`}
                                >
                                    신고
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            </section>
            <section className="shared-diary-section" aria-labelledby="shared-diary-title">
                <div className="shared-diary-heading">
                    <div>
                        <p className="shared-diary-eyebrow">AI와 함께 남긴 마음의 기록</p>
                        <h2 id="shared-diary-title">오늘의 감정일기</h2>
                        <p>상담을 마친 뒤 정리된 이야기를 서로 나눠보세요.</p>
                    </div>
                    <button type="button" className="shared-diary-more" onClick={() => navigate('/diaryList')}>전체 일기 보기 →</button>
                </div>
                <div className="shared-diary-list">
                    {sharedDiaries.length === 0 ? <p className="shared-diary-empty">아직 공유된 감정일기가 없습니다.</p> : sharedDiaries.map((diary) => (
                        <article className="shared-diary-card" key={diary.id}>
                            <div className="shared-diary-card-top">
                                <span className="shared-diary-date">{diary.date}</span>
                                <span className="shared-diary-mood">{diary.mood}</span>
                            </div>
                            <h3>{diary.title}</h3>
                            <p>{diary.content}</p>
                            <span className="shared-diary-author">✦ {diary.author}</span>
                        </article>
                    ))}
                </div>
            </section>
            {reportTarget && (
                <div className="board-report-modal-backdrop" role="presentation" onClick={() => setReportTarget(null)}>
                    <form className="board-report-modal" onSubmit={handleReportSubmit} onClick={(event) => event.stopPropagation()}>
                        <div className="board-report-modal-header">
                            <h2>게시글 신고</h2>
                            <button type="button" onClick={() => setReportTarget(null)} aria-label="신고 창 닫기">×</button>
                        </div>
                        <p className="board-report-modal-title">{reportTarget.title}</p>
                        <label htmlFor="report-reason">신고 사유</label>
                        <select id="report-reason" value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
                            <option>부적절한 내용</option>
                            <option>욕설·혐오 표현</option>
                            <option>개인정보 노출</option>
                            <option>광고·도배</option>
                            <option>기타</option>
                        </select>
                        <label htmlFor="report-detail">상세 내용 <span>(선택)</span></label>
                        <textarea id="report-detail" value={reportDetail} onChange={(event) => setReportDetail(event.target.value)} maxLength="500" placeholder="검토에 필요한 내용을 입력해주세요." />
                        <button type="submit" className="board-report-submit">신고 접수</button>
                    </form>
                </div>
            )}
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
                            <button key={mood.name} className={todayMood === mood.name ? 'mood-item active' : 'mood-item'} onClick={() => setTodayMood(mood.name)}>
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
