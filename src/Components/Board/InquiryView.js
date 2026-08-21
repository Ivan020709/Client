import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './InquiryView.css';

function InquiryView() {

    const navigate = useNavigate();
    const { inquirynum } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((result) => { setPost(result.data.inquiry); })
            .catch(() => { navigate('/InquiryList'); });
    }, [inquirynum, navigate]);

    const handleDelete = () => {
        if (!window.confirm('문의를 삭제하시겠습니까?')) {
            return;
        }

        axios.delete(`/api/inquiry/deleteInquiry/${inquirynum}`)
            .then((result) => {
                if (result.data.msg === 'OK') {
                    alert('문의가 삭제되었습니다.');
                    navigate('/InquiryList');
                } else {
                    alert('문의 삭제에 실패했습니다.');
                }
            })
            .catch((err) => {
                console.error(err);
                alert('문의 삭제 중 오류가 발생했습니다.');
            });
    };

    if (!post) return <div>불러오는 중...</div>;

    return (

        <div className="inquiry-view-page">
            {/* =========================
                상단 제목
            ========================= */}
            <div className="inquiry-view-header">
                <h1 className="inquiry-view-heading">
                    문의 상세 내용
                </h1>

            </div>


            {/* =========================
                문의 내용
            ========================= */}
            <div className="inquiry-view-card">
                {/* 제목 */}
                <div className="inquiry-view-title-area">

                    <h2 className="inquiry-view-title">
                        {post.title}
                    </h2>

                </div>
                {/* 작성자 / 날짜 */}
                <div className="inquiry-view-info">
                    <span className="inquiry-view-writer">
                        작성자 : {post.userid}
                    </span>

                    <span className="inquiry-view-date">
                        작성일 : {post.indate?.substring(0, 10)}
                    </span>

                </div>

                {/* 내용 */}

                <div className="inquiry-view-content">
                    {post.content}
                </div>

            </div>


            {/* =========================
                하단 버튼
            ========================= */}

            <div className="inquiry-view-actions">


                {/* 왼쪽 */}

                <button
                    type="button"
                    className="inquiry-view-list-btn"
                    onClick={() => navigate('/InquiryList')}
                >
                    목록으로
                </button>
                {/* 오른쪽 */}
                <div className="inquiry-view-action-group">

                    <button
                        type="button"
                        className="inquiry-view-edit-btn"
                        onClick={() =>
                            navigate(`/UpdateInquiry/${inquirynum}`)
                        }
                    >
                        수정
                    </button>


                    <button
                        type="button"
                        className="inquiry-view-delete-btn"
                        onClick={() =>
                            handleDelete()
                        }
                    >
                        삭제
                    </button>

                </div>


            </div>


        </div>

    );
}

export default InquiryView;
