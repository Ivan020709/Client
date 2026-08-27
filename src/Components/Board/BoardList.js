import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ReportModal from '../Common/ReportModal';
import './BoardList.css';
import jaxios from '../../utils/jwtUtil'

const CATEGORY_ICONS = {
    연애: '💗', 가족: '🏠', 친구관계: '🫂', 진로: '🧭', 학교: '🎒', 기타: '📣'
};
const MEMO_COLORS = ['#ffdede', '#fff4b8', '#dff1ff', '#e7ddff', '#dff5df', '#ffe8c9', '#f9dff1', '#dff5ef'];

function relativeTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function authorName(post) {
    if (post.isprivate && !post.email) return '비공개';
    // 서버에서 받은 회원 이름을 우선 표시합니다.
    return post.writerName || post.email?.split('@')[0] || `마음친구 ${post.userid}`;
}

function BoardList() {
    const navigate = useNavigate();
    const loginUser = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [paging, setPaging] = useState(null);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reportTarget, setReportTarget] = useState(null);
    const [reportBoardnum, setReportBoardnum] = useState(null);

    const loadPosts = async (pageNumber, sortType = sort) => {
        setLoading(true);
        setError('');
        try {
            const result = await axios.get(`/api/board/getBoardList/${pageNumber}`, {
                params: {
                    sort: sortType,
                    ...(loginUser?.userid ? { userId: loginUser.userid } : {})
                }
            });
            setPosts(result.data.boardList || []);
            setPaging(result.data.paging);
        } catch (loadError) {
            console.error(loadError);
            setError('게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts(page, sort);
    }, [page, sort]); // eslint-disable-line react-hooks/exhaustive-deps

    const requireLogin = (message) => {
        if (loginUser?.userid) return true;
        alert(message);
        navigate('/memberLogin', { state: { from: '/boardList' } });
        return false;
    };

    const changeSort = (nextSort) => {
        if (sort === nextSort) return;
        setPage(1);
        setSort(nextSort);
    };

    const openPost = async (boardnum) => {
        try {
            await axios.post('/api/board/plusCount', null, { params: { boardnum } });
            navigate(`/boardView/${boardnum}`);
        } catch (openError) {
            console.error(openError);
        }
    };

    const toggleLike = async (event, post) => {
        event.stopPropagation();
        if (!requireLogin('공감은 로그인 후 이용할 수 있습니다.')) return;
        try {
            const result = await jaxios.post('/api/board/toggleLike', null, {
                params: { boardId: post.boardnum, userId: loginUser.userid }
            });
            setPosts((current) => current.map((item) => item.boardnum === post.boardnum
                ? { ...item, likedByMe: result.data.liked, likeCount: result.data.likeCount }
                : item));
            if (sort === 'likes') await loadPosts(page, sort);
        } catch (likeError) {
            console.error(likeError);
            alert('공감 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const openReport = (event, post) => {
        event.stopPropagation();
        if (!requireLogin('신고는 로그인 후 이용할 수 있습니다.')) return;
        if (Number(post.userid) === Number(loginUser.userid)) {
            alert('본인의 게시글은 신고할 수 없습니다.');
            return;
        }
        setReportTarget(post);
        setReportBoardnum(post.boardnum);
    };

    const totalPages = Math.ceil((paging?.totalCount ?? 0) / (paging?.displayRow || 8));

    return (
        <main className="concern-board-page">
            <header className="concern-board-hero">
                <span>FEEL TOGETHER</span>
                <h1>고민 게시판</h1>
                <p>혼자 담아두었던 마음을 나누고, 서로에게 따뜻한 공감을 건네요.</p>
            </header>

            <section className="concern-board-container" aria-label="고민 게시글 목록">
                <div className="concern-board-toolbar">
                    <div className="concern-sort" role="group" aria-label="게시글 정렬">
                        <button className={sort === 'latest' ? 'active' : ''} onClick={() => changeSort('latest')}>✨ 최신순</button>
                        <button className={sort === 'likes' ? 'active' : ''} onClick={() => changeSort('likes')}>💗 공감순</button>
                    </div>
                    <div className="concern-board-actions">
                        <span>전체 <strong>{paging?.totalCount ?? 0}</strong>개</span>
                        <button className="concern-write-button" onClick={() => requireLogin('글쓰기는 로그인 후 이용할 수 있습니다.') && navigate('/boardWrite')}>고민 나누기</button>
                    </div>
                </div>

                {loading ? (
                    <div className="concern-board-message">게시글을 불러오고 있어요.</div>
                ) : error ? (
                    <div className="concern-board-message error">{error}<button onClick={() => loadPosts(page, sort)}>다시 시도</button></div>
                ) : posts.length === 0 ? (
                    <div className="concern-board-message">아직 등록된 고민이 없습니다. 첫 이야기를 남겨보세요.</div>
                ) : (
                    <div className="notebook-board">
                        <div className="notebook-board-rings" aria-hidden="true" />
                        <div className="notebook-board-line" aria-hidden="true" />
                        <div className="notebook-board-grid">
                            {posts.map((post, index) => (
                                <article
                                    className={`notebook-board-memo${post.isprivate ? ' private' : ''}`}
                                    key={post.boardnum}
                                    style={{
                                        '--memo-color': MEMO_COLORS[index % MEMO_COLORS.length],
                                        '--memo-rotation': `${index % 2 === 0 ? -1 : 1}deg`
                                    }}
                                    onClick={() => openPost(post.boardnum)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            openPost(post.boardnum);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="notebook-memo-pin" aria-hidden="true" />
                                    <div className="notebook-board-heading">
                                        <h2>{post.title}</h2>
                                        <span>#{post.category || '고민'}</span>
                                    </div>
                                    <p className="notebook-board-content">{post.content || (post.isprivate ? '작성자만 확인할 수 있는 고민입니다.' : '내용이 없습니다.')}</p>
                                    <div className="notebook-board-meta">
                                        <span>{post.isprivate ? '🔒 ' : `${CATEGORY_ICONS[post.category] || '💬'} `}{authorName(post)} · {relativeTime(post.indate)}</span>
                                    </div>
                                    <div className="notebook-board-actions">
                                        <button className={post.likedByMe ? 'liked' : ''} onClick={(event) => toggleLike(event, post)}>♡ <span>공감 {post.likeCount || 0}</span></button>
                                        <span>댓글 {post.commentCount || 0}</span>
                                        <span>조회 {post.viewcount || 0}</span>
                                        <button className="notebook-board-report" onClick={(event) => openReport(event, post)}>신고</button>
                                    </div>
                                    <span className="notebook-board-arrow" aria-hidden="true">→</span>
                                </article>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <nav className="concern-pagination on-notebook" aria-label="게시판 페이지">
                                <button disabled={page === 1} onClick={() => setPage((current) => current - 1)} aria-label="이전 페이지">‹</button>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                                    <button key={number} className={page === number ? 'active' : ''} onClick={() => setPage(number)}>{number}</button>
                                ))}
                                <button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} aria-label="다음 페이지">›</button>
                            </nav>
                        )}
                    </div>
                )}

            </section>

            {reportTarget && (
                <ReportModal
                    post={reportTarget}
                    boardnum={reportBoardnum}
                    onClose={() => setReportTarget(null)}
                />
            )}
        </main>
    );
}

export default BoardList;
