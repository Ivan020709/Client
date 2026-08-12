import React, { useState } from 'react';
import '../../style/board/BoardList.css';

function BoardList() {

    // 임시 게시글 데이터
    // 나중에 axios로 서버 데이터를 받아오면 이 부분을 교체하면 됩니다.
    const [posts/*, setPosts*/] = useState([{id: 10, user_id: 1, nickname: '행복한사람', title: '요즘 고민이 있는데 어떻게 해야 할까요?', content: '친구 관계 때문에 고민이 있습니다.', view_count: 32, created_at: '2026-08-12'}, {id: 9, user_id: 2, nickname: '고민상담', title: '취업 준비가 너무 막막해요', content: '요즘 취업 준비를 하면서  여러 가지 고민이 생겼습니다.', view_count: 51, created_at: '2026-08-11'}, {id: 8, user_id: 3, nickname: '익명', title: '친구와 화해하고 싶은데...', content: '제가 먼저 사과하는 게 좋을까요?', view_count: 27, created_at: '2026-08-11'}, {id: 7, user_id: 4, nickname: '마음이복잡해', title: '학교생활이 힘들어요', content: '최근 학교생활 때문에 스트레스를 받고 있습니다.', view_count: 64, created_at: '2026-08-10' }, {id: 6, user_id: 5, nickname: '오늘도힘내', title: '내 MBTI가 너무 신경 쓰여요', content: 'MBTI 때문에 사람들의 시선을 신경 쓰게 됩니다.', view_count: 19, created_at: '2026-08-10'}, {id: 5, user_id: 6, nickname: '고민러', title: '진로를 어떻게 정해야 할까요?', content: '제가 정말 하고 싶은 일이 무엇인지 모르겠습니다.', view_count: 42, created_at: '2026-08-09'}, {id: 4, user_id: 7, nickname: '익명', title: '사람들과 대화하는 게 어려워요', content: '어떻게 하면 사람들과 편하게 대화할 수 있을까요?', view_count: 38, created_at: '2026-08-09'}, {id: 3, user_id: 8, nickname: '고민상담소', title: '요즘 계속 우울한 기분이 들어요', content: '별일이 없는데도 기분이 가라앉아 있습니다.', view_count: 73, created_at: '2026-08-08'}]);
    const [searchType, setSearchType] = useState('title');
    const [searchKeyword, setSearchKeyword] = useState('');
    // 검색
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) { return; }
        // console.log('검색:', searchType, searchKeyword);
        // 추후 axios API 연결
        // GET /api/boards?searchType=title&keyword=...
    };
    // 글쓰기
    const handleWrite = () => {
        // console.log('글쓰기 페이지 이동');
        // navigate('/board/write');
    };
    // 게시글 클릭
    const handlePostClick = (id) => {
        // console.log('게시글 상세:', id);
        // navigate(`/board/${id}`);
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
                    <span>전체 게시글 <strong>{posts.length}</strong></span>
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
                    {posts.map((post) => (
                        <div className="board-row" key={post.id} onClick={() => handlePostClick(post.id)}>
                            <div className="board-number">{post.id}</div>
                            <div className="board-title">{post.title}</div>
                            <div className="board-writer">{post.nickname}</div>
                            <div className="board-date">{post.created_at}</div>
                            <div className="board-view">{post.view_count}</div>
                        </div>
                    ))}
                </div>
                {/* 검색 */}
                <form className="board-search" onSubmit={handleSearch}>
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="writer">작성자</option>
                    </select>
                    <input type="text" placeholder="검색어를 입력해주세요." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>
                    <button type="submit">검색</button>
                </form>
                {/* 페이지네이션 */}
                <div className="pagination">
                    <button className="page-arrow">&lt;</button>
                    <button className="page active">1</button>
                    <button className="page">2</button>
                    <button className="page">3</button>
                    <button className="page">4</button>
                    <button className="page">5</button>
                    <button className="page-arrow">&gt;</button>
                </div>
            </div>
        </div>
    );
}

export default BoardList;