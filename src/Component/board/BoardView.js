import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/board/BoardView.css';

function BoardView() {

    const navigate = useNavigate();
    const { boardnum } = useParams();
    // 임시 게시글 데이터
    // 나중에 axios로 /api/board/getBoard/{boardnum} 연결
    const [post] = useState({});
    // 임시 댓글
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    // 목록
    const handleList = () => { navigate('/boardList'); };
    // 수정
    const handleUpdate = () => { navigate(`/updateBoard/${boardnum}`); };
    // 삭제
    const handleDelete = () => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            // console.log('게시글 삭제:', id);
            // 나중에 axios 연결
            // axios.delete(`/api/board/deleteBoard/${id}`)
        }
    };
    // 댓글 등록
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }
        const newComment = {id: comments.length + 1, nickname: '현재사용자', content: comment, created_at: '2026-08-13'};
        setComments([...comments, newComment]);
        setComment('');
        // 나중에 axios 연결
        // axios.post('/api/board/insertComment', {
        //     boardnum: id,
        //     content: comment
        // });
    };
    return (
        <div className="board-view-page">
            {/* 상단 */}
            <div className="board-view-header">
                <button className="board-back-btn" onClick={handleList}>←</button>
                <h1>고민 게시판</h1>
            </div>
            <div className="board-view-container">
                {/* 게시글 */}
                <div className="board-view-post">
                    {/* 카테고리 */}
                    <div className="board-view-category">{post.category}</div>
                    {/* 제목 */}
                    <h2 className="board-view-title">{post.title}</h2>
                    {/* 작성자 정보 */}
                    <div className="board-view-info">
                        <span>작성자 <strong>{post.userid}</strong></span>
                        <span>작성일 {post.indate}</span>
                        <span>조회 {post.viewcount}</span>
                    </div>
                    {/* 내용 */}
                    <div className="board-view-content">{post.content}</div>
                    {/* 게시글 버튼 */}
                    <div className="board-view-buttons">
                        <button className="board-list-btn" onClick={handleList}>목록</button>
                        <div className="board-owner-buttons">
                            <button className="board-update-btn" onClick={handleUpdate}>수정</button>
                            <button className="board-delete-btn" onClick={handleDelete}>삭제</button>
                        </div>
                    </div>
                </div>
                {/* 댓글 */}
                <div className="board-comment-section">
                    <div className="board-comment-title">댓글 <strong>{comments.length}</strong></div>
                    {/* 댓글 목록 */}
                    <div className="board-comment-list">
                        {comments.length > 0 ? (
                            comments.map((item) => (
                                <div className="board-comment" key={item.id}>
                                    <div className="board-comment-info">
                                        <strong>{item.nickname}</strong>
                                        <span>{item.created_at}</span>
                                    </div>
                                    <div className="board-comment-content">{item.content}</div>
                                </div>
                            ))
                        ) : (<div className="board-no-comment">아직 댓글이 없습니다.</div>
                        )}
                    </div>
                    {/* 댓글 작성 */}
                    <form className="board-comment-form" onSubmit={handleCommentSubmit}>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="댓글을 입력해주세요."/>
                        <button type="submit">댓글 등록</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BoardView;