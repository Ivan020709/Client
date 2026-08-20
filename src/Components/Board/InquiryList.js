import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './BoardList.css';

function InquiryList() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [paging, setPaging] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        axios.get(`/api/inquiry/getInquiryList/${page}`)
            .then((result) => {
                setPosts(result.data.inquiryList);
                setPaging(result.data.paging);
            }).catch((err) => { console.error('문의 목록 조회 실패:', err); });
    }, [page]);

    return (
        <div className="board-list-page">
            <div className="board-header">
                <h1>문의 사항</h1>
                <p>궁금한 점을 남겨주시면 빠르게 답변해 드리겠습니다.</p>
            </div>
            <div className="board-container">
                <div className="board-top">
                    <span>전체 문의 <strong>{paging?.totalCount ?? 0}</strong></span>
                    <button className="board-write-btn" onClick={() => navigate('/InquiryWrite')}>문의하기</button>
                </div>
                <div className="board-table">
                    <div className="board-table-header">
                        <div className="board-number">번호</div>
                        <div className="board-title">제목</div>
                        <div className="board-writer">작성자</div>
                        <div className="board-date">작성일</div>
                        <div className="board-view">상태</div>
                    </div>
                    {posts.length > 0 ? posts.map((post) => (
                        <div className="board-row" key={post.inquirynum} onClick={() => navigate(`/InquiryView/${post.inquirynum}`)}>
                            <div className="board-number">{post.inquirynum}</div>
                            <div className="board-title">{post.title}</div>
                            <div className="board-writer">{post.userid}</div>
                            <div className="board-date">{post.indate?.substring(0, 10)}</div>
                            <div className="board-view">{post.status || '대기중'}</div>
                        </div>
                    )) : <div className="board-empty">문의 내역이 없습니다.</div>}
                </div>
            </div>
        </div>
    );
}
export default InquiryList;