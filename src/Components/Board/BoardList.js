import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './BoardList.css';

function BoardList() {

    const navigate = useNavigate();
    // 게시글 목록
    const [posts, setPosts] = useState([]);
    // 페이징
    const [paging, setPaging] = useState(null);
    // 현재 페이지
    const [page, setPage] = useState(1);
    const [searchType, setSearchType] = useState('title');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 페이지가 변경될 때마다 게시글 조회
    useEffect(() => {
        getBoardList(page);
    }, [page]);

    // 게시글 목록 조회
    const getBoardList = (page) => {
        axios.get(`/api/board/getBoardList/${page}`)
            .then((result) => {
                // console.log('게시글 목록:', result.data);
                setPosts(result.data.boardList);
                setPaging(result.data.paging);
            }).catch((err) => { console.error('게시글 목록 조회 실패:', err); });
    };

    // 검색
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) { return; }
        // console.log('검색:', searchType, searchKeyword);
        // 나중에 검색 API 연결
    };

    // 글쓰기
    const handleWrite = () => { navigate('/boardWrite'); };

    // 게시글 클릭
    const handlePostClick = (boardnum) => {
        axios.post('/api/board/plusCount', null, { params: { boardnum } })
            .then((result) => {
                navigate(`/boardView/${boardnum}`)
            })
            .catch((err) => { console.error(err) })
    };

    const ROWS_PER_PAGE = 5;

    const totalPages = Math.ceil(
        (paging?.totalCount ?? 0) / ROWS_PER_PAGE
    );

    // 페이지 이동
    const handlePage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) {
            return;
        }

        setPage(pageNumber);
    };

    return (
        <div className="board-list-page">
            {/* 페이지 헤더 */}
            <div className="board-header">
                <div>
                    <h1>고민 게시판</h1>
                    <p>여러분의 고민과 이야기를 자유롭게 나눠보세요.</p>
                </div>
            </div>
            {/* 게시글 영역 */}
            <div className="board-container">
                {/* 게시글 수 */}
                <div className="board-top">
                    <span>전체 게시글 <strong>{paging?.totalCount ?? 0}</strong></span>
                    <button className="board-write-btn" onClick={handleWrite}>글쓰기</button>
                </div>
                {/* 게시글 목록 */}
                <div className="board-table">
                    {/* 테이블 헤더 */}
                    <div className="board-table-header">
                        <div className="board-number">번호</div>
                        <div className="board-title">제목</div>
                        <div className="board-writer">작성자</div>
                        <div className="board-date">작성일</div>
                        <div className="board-view">조회</div>
                    </div>
                    {/* 게시글 */}
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div className="board-row" key={post.boardnum} onClick={() => handlePostClick(post.boardnum)}>
                                <div className="board-number">{post.boardnum}</div>
                                <div className="board-title">{post.title}</div>
                                <div className="board-writer">{post.userid}</div>
                                <div className="board-date">{post.indate ? post.indate.substring(0, 10) : ''}</div>
                                <div className="board-view">{post.viewcount}</div>
                            </div>
                        ))
                    ) : (
                        <div className="board-empty">게시글이 없습니다.</div>
                    )}
                </div>
                {/* 검색 */}
                <form className="board-search" onSubmit={handleSearch}>
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="userid">작성자</option>
                    </select>
                    <input type="text" placeholder="검색어를 입력해주세요." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                    <button type="submit">검색</button>
                </form>
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="pagination">

                        {/* 이전 */}
                        {page > 1 && (
                            <button
                                className="page-arrow"
                                onClick={() => handlePage(page - 1)}
                            >
                                &lt;
                            </button>
                        )}

                        {/* 페이지 번호 */}
                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`page ${page === pageNumber ? 'active' : ''
                                    }`}
                                onClick={() => handlePage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        {/* 다음 */}
                        {page < totalPages && (
                            <button
                                className="page-arrow"
                                onClick={() => handlePage(page + 1)}
                            >
                                &gt;
                            </button>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

export default BoardList;
