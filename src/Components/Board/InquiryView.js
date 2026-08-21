import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './Inquiry.css';

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
        <div className="inquiry-view-page">
            <div className="inquiry-view-header">
                <button onClick={() => navigate('/InquiryList')}>목록으로</button>
                <h1>문의 상세 내용</h1>
            </div>
            <div className="inquiry-container">
                <h2>{post.title}</h2>
                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                    작성자: {post.userid} | 작성일: {post.indate?.substring(0, 10)}
                </div>
                <div style={{ minHeight: '300px' }}>{post.content}</div>
            </div>
            <div className="inquiry-view-buttons">
                <button className="inquiry-cancel-btn" onClick={() => navigate('/InquiryList')}>목록으로</button>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="inquiry-cancel-btn" onClick={() => navigate(`/UpdateInquiry/${inquirynum}`)}>수정</button>
                    <button className="inquiry-submit-btn" onClick={() => alert('삭제 기능 구현 예정')}>삭제</button>
                </div>
            </div>
        </div>

        // 내부 버튼 영역 

    );
}
export default InquiryView;