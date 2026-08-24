import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import './InquiryView.css';

function InquiryView() {

    const navigate = useNavigate();
    const { inquirynum } = useParams();

    // 로그인 사용자
    const loginUser = useSelector(state => state.user);

    // 문의글
    const [post, setPost] = useState(null);

    // 댓글
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    // 수정 중인 댓글
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');


    // =====================================================
    // 문의글 조회
    // =====================================================

    useEffect(() => {

        axios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((result) => {

                setPost(result.data.inquiry);

            })
            .catch((err) => {

                console.error('문의글 조회 실패:', err);

                alert('문의글을 불러오지 못했습니다.');

                navigate('/InquiryList');

            });

    }, [inquirynum, navigate]);


    // =====================================================
    // 댓글 등록
    // =====================================================

    const handleCommentSubmit = (e) => {

        e.preventDefault();

        // 로그인 확인
        if (!loginUser?.userid) {

            alert('댓글은 로그인 후 작성할 수 있습니다.');

            navigate('/memberLogin', {
                state: {
                    from: `/inquiryView/${inquirynum}`
                }
            });

            return;
        }


        // 빈 댓글 확인
        if (!comment.trim()) {

            alert('댓글을 입력해주세요.');

            return;
        }


        // 임시 댓글
        const newComment = {

            id: Date.now(),

            userid: loginUser.userid,

            // Redux에 nickname이 있다면 사용
            nickname:
                loginUser.nickname ||
                loginUser.nickName ||
                loginUser.userid,

            content: comment.trim(),

            created_at: new Date().toLocaleDateString('ko-KR')

        };


        setComments((prev) => [
            ...prev,
            newComment
        ]);


        setComment('');

    };


    // =====================================================
    // 댓글 수정 시작
    // =====================================================

    const handleCommentEditStart = (item) => {

        setEditingCommentId(item.id);

        setEditingContent(item.content);

    };


    // =====================================================
    // 댓글 수정 취소
    // =====================================================

    const handleCommentEditCancel = () => {

        setEditingCommentId(null);

        setEditingContent('');

    };


    // =====================================================
    // 댓글 수정 완료
    // =====================================================

    const handleCommentEdit = (id) => {

        if (!editingContent.trim()) {

            alert('댓글 내용을 입력해주세요.');

            return;
        }


        setComments((prev) =>
            prev.map((item) => {

                if (item.id === id) {

                    return {
                        ...item,
                        content: editingContent.trim()
                    };

                }

                return item;

            })
        );


        setEditingCommentId(null);

        setEditingContent('');

    };


    // =====================================================
    // 댓글 삭제
    // =====================================================

    const handleCommentDelete = (id) => {

        if (!window.confirm('댓글을 삭제하시겠습니까?')) {
            return;
        }


        setComments((prev) =>
            prev.filter((item) => item.id !== id)
        );

    };


    // =====================================================
    // 문의글 삭제
    // =====================================================

    const handleDelete = () => {

        if (!window.confirm('문의를 삭제하시겠습니까?')) {
            return;
        }


        axios.delete(
            `/api/inquiry/deleteInquiry/${inquirynum}`
        )
            .then((result) => {

                if (result.data.msg === 'OK') {

                    alert('문의가 삭제되었습니다.');

                    navigate('/InquiryList');

                } else {

                    alert('문의 삭제에 실패했습니다.');

                }

            })
            .catch((err) => {

                console.error('문의 삭제 실패:', err);

                alert('문의 삭제 중 오류가 발생했습니다.');

            });

    };


    // =====================================================
    // 로딩
    // =====================================================

    if (!post) {

        return (

            <div className="inquiry-view-page">

                <div className="inquiry-view-loading">
                    문의글을 불러오는 중입니다...
                </div>

            </div>

        );

    }


    // =====================================================
    // 화면
    // =====================================================

    return (

        <div className="inquiry-view-page">


            {/* =================================================
                상단 헤더
            ================================================= */}

            <div className="inquiry-view-header">

                <button
                    type="button"
                    className="inquiry-view-back"
                    onClick={() => navigate('/InquiryList')}
                >
                    ← 목록
                </button>


                <h1 className="inquiry-view-heading">
                    문의 상세 내용
                </h1>

            </div>


            {/* =================================================
                문의글
            ================================================= */}

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
                        작성자 : <strong>{post.userid}</strong>
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


            {/* =================================================
                하단 버튼
            ================================================= */}

            <div className="inquiry-view-actions">

                <button
                    type="button"
                    className="inquiry-view-list-btn"
                    onClick={() => navigate('/InquiryList')}
                >
                    목록으로
                </button>


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
                        onClick={handleDelete}
                    >
                        삭제
                    </button>

                </div>

            </div>


            {/* =================================================
                댓글 영역
            ================================================= */}

            <div className="inquiry-comment-section">


                {/* 댓글 제목 */}

                <div className="inquiry-comment-title">

                    댓글 <strong>{comments.length}</strong>

                </div>


                {/* =================================================
                    댓글 목록
                ================================================= */}

                <div className="inquiry-comment-list">

                    {comments.length > 0 ? (

                        comments.map((item) => (

                            <div
                                className="inquiry-comment"
                                key={item.id}
                            >

                                {/* 댓글 상단 정보 */}

                                <div className="inquiry-comment-header">

                                    <div className="inquiry-comment-user">

                                        <span className="inquiry-comment-avatar">
                                            {item.nickname?.charAt(0)}
                                        </span>

                                        <strong>
                                            {item.nickname}
                                        </strong>

                                        <span className="inquiry-comment-date">
                                            {item.created_at}
                                        </span>

                                    </div>


                                    {/* 수정 / 삭제 */}
                                    {Number(loginUser?.userid) === Number(item.userid) && (
                                        <div className="inquiry-comment-actions">

                                            <button
                                                type="button"
                                                className="inquiry-comment-edit-btn"
                                                onClick={() =>
                                                    handleCommentEditStart(item)
                                                }
                                            >
                                                수정
                                            </button>

                                            <button
                                                type="button"
                                                className="inquiry-comment-delete-btn"
                                                onClick={() =>
                                                    handleCommentDelete(item.id)
                                                }
                                            >
                                                삭제
                                            </button>

                                        </div>
                                    )}

                                </div>


                                {/* =================================================
                                    댓글 수정 중
                                ================================================= */}

                                {editingCommentId === item.id ? (

                                    <div className="inquiry-comment-edit-area">

                                        <textarea
                                            value={editingContent}
                                            onChange={(e) =>
                                                setEditingContent(e.target.value)
                                            }
                                        />

                                        <div className="inquiry-comment-edit-actions">

                                            <button
                                                type="button"
                                                className="inquiry-comment-save-btn"
                                                onClick={() =>
                                                    handleCommentEdit(item.id)
                                                }
                                            >
                                                저장
                                            </button>

                                            <button
                                                type="button"
                                                className="inquiry-comment-cancel-btn"
                                                onClick={handleCommentEditCancel}
                                            >
                                                취소
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    /* 댓글 내용 */

                                    <div className="inquiry-comment-content">
                                        {item.content}
                                    </div>

                                )}

                            </div>

                        ))

                    ) : (

                        <div className="inquiry-no-comment">
                            아직 댓글이 없습니다.
                        </div>

                    )}

                </div>


                {/* =================================================
                    댓글 작성
                ================================================= */}

                <form
                    className="inquiry-comment-form"
                    onSubmit={handleCommentSubmit}
                >

                    <textarea
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        placeholder="댓글을 입력해주세요."
                    />


                    <button type="submit">
                        댓글 등록
                    </button>

                </form>

            </div>

        </div>

    );

}

export default InquiryView;
