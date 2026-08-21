import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Inquiry.css'; // 수정된 CSS 파일

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
            }).catch((err) => { console.error(err); });
    }, [page]);

    return (
        <div className="inquiry-list-page">
            <div className="inquiry-header">
                <h1>문의 사항</h1>
                <p>궁금한 점을 남겨주시면 빠르게 답변해 드리겠습니다.</p>
            </div>
            <div className="inquiry-container">
                <button onClick={() => navigate('/InquiryWrite')}>문의하기</button>
                <div className="inquiry-table">
                    <div className="inquiry-table-header">
                        <div className="inquiry-number">번호</div>
                        <div className="inquiry-title">제목</div>
                        <div className="inquiry-writer">작성자</div>
                        <div className="inquiry-date">작성일</div>
                        <div className="inquiry-status">상태</div>
                    </div>
                    {posts.length > 0 ? posts.map((post) => (
                        <div className="inquiry-row" key={post.inquirynum} onClick={() => navigate(`/InquiryView/${post.inquirynum}`)}>
                            <div className="inquiry-number">{post.inquirynum}</div>
                            <div className="inquiry-title">{post.title}</div>
                            <div className="inquiry-writer">{post.userid}</div>
                            <div className="inquiry-date">{post.indate?.substring(0, 10)}</div>
                            <div className="inquiry-status">{post.status || '대기중'}</div>
                        </div>
                    )) : <div>문의 내역이 없습니다.</div>}
                </div>
            </div>
        </div>
    );
}
export default InquiryList;