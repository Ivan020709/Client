import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './BoardView.css';

function InquiryView() {
    const navigate = useNavigate();
    const { inquirynum } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((result) => { setPost(result.data.inquiry); })
            .catch(() => { navigate('/InquiryList'); });
    }, [inquirynum, navigate]);

    if (!post) return <div>불러오는 중...</div>;

    return (
        <div className="board-view-page">
            <div className="board-view-header">
                <button className="board-back-btn" onClick={() => navigate('/InquiryList')}>←</button>
                <h1>문의 상세</h1>
            </div>
            <div className="board-view-container">
                <div className="board-view-post">
                    <h2 className="board-view-title">{post.title}</h2>
                    <div className="board-view-info">
                        <span>작성자 <strong>{post.userid}</strong></span>
                        <span>작성일 {post.indate?.substring(0, 10)}</span>
                    </div>
                    <div className="board-view-content">{post.content}</div>
                </div>
            </div>
        </div>
    );
}
export default InquiryView;