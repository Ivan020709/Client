import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/submenu.css';

function SubMenu() {
    const navigate = useNavigate();
    return (
        <div className="sub_menu">
            <div className="sub_menu_top">
                <div className="sub_menu_item">
                    <div className="sub_menu_title">고민상담</div>
                    <div className="sub_dropdown">
                        <div>필로그란?</div>
                        <div onClick={() => { navigate('/SelectAi') }}>대화신청</div>
                        <div onClick={() => navigate('/Diary')}>감정 일기</div>
                    </div>
                </div>

                <div className="sub_menu_item">
                    <div className="sub_menu_title">마이페이지</div>
                </div>
                <div className="sub_menu_item">
                    <div className="sub_menu_title">커뮤니티</div>
                    <div className="sub_dropdown">
                        <div onClick={() => { navigate('/BoardList') }}>자유게시판</div>
                        <div>일기 공유</div>
                        <div>문의 사항</div>
                        <div>공지 사항</div>
                    </div>
                </div>
                <div className="sub_menu_item">
                    <div className="sub_menu_title">이용안내</div>
                    <div className="sub_dropdown">
                        <div onClick={() => { navigate('/Hellow') }}>인사말</div>
                        <div onClick={() => { navigate('/Info') }}>상담센터</div>
                        <div>위치 정보</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SubMenu;