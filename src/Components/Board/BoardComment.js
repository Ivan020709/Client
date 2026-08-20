import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './BoardComment.css';

function BoardComment({ boardId, onCountChange }) {
    const loginUser = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    const loadComments = async () => {
        const result = await axios.get(`/api/board/${boardId}/comments`, {
            params: loginUser?.userid ? { userId: loginUser.userid } : {}
        });
        const next = result.data.comments || [];
        setComments(next);
        onCountChange?.(next.length);
    };

    useEffect(() => { loadComments().catch(console.error); }, [boardId]); // eslint-disable-line react-hooks/exhaustive-deps

    const requireLogin = () => {
        if (loginUser?.userid) return true;
        alert('댓글은 로그인 후 작성할 수 있습니다.');
        navigate('/memberLogin', { state: { from: `/boardView/${boardId}` } });
        return false;
    };

    const create = async (event) => {
        event.preventDefault();
        if (!requireLogin() || !content.trim()) return;
        await axios.post(`/api/board/${boardId}/comments`, { content }, {
            params: { userId: loginUser.userid }
        });
        setContent('');
        await loadComments();
    };

    const update = async (commentId) => {
        if (!editingContent.trim()) return;
        await axios.put(`/api/board/comments/${commentId}`, { content: editingContent }, {
            params: { userId: loginUser.userid }
        });
        setEditingId(null);
        setEditingContent('');
        await loadComments();
    };

    const remove = async (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
        await axios.delete(`/api/board/comments/${commentId}`, {
            params: { userId: loginUser.userid }
        });
        await loadComments();
    };

    return (
        <section className="board-comments">
            <h3>댓글 <strong>{comments.length}</strong></h3>
            <div className="board-comment-list">
                {comments.length === 0 && <p className="board-comment-empty">아직 댓글이 없습니다.</p>}
                {comments.map((item) => {
                    const mine = Number(loginUser?.userid) === Number(item.userId);
                    return <article className="board-comment-item" key={item.id}>
                        <div className="board-comment-meta"><strong>회원 {item.userId}</strong><span>{item.createdAt?.substring(0, 16).replace('T', ' ')}</span></div>
                        {editingId === item.id ? <div className="board-comment-edit">
                            <textarea value={editingContent} onChange={(e) => setEditingContent(e.target.value)} />
                            <button type="button" onClick={() => update(item.id)}>저장</button>
                            <button type="button" onClick={() => setEditingId(null)}>취소</button>
                        </div> : <p>{item.content}</p>}
                        {mine && editingId !== item.id && <div className="board-comment-actions">
                            <button type="button" onClick={() => { setEditingId(item.id); setEditingContent(item.content); }}>수정</button>
                            <button type="button" onClick={() => remove(item.id)}>삭제</button>
                        </div>}
                    </article>;
                })}
            </div>
            <form className="board-comment-form" onSubmit={create}>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="따뜻한 댓글을 남겨주세요." />
                <button type="submit">댓글 등록</button>
            </form>
        </section>
    );
}

export default BoardComment;
