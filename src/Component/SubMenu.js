import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/submenu.css';

function SubMenu() {
    const navigate = useNavigate();
    return (
        <div className="sub_menu">
            <div className="sub_menu_top">
                <div className="sub_menu_item">
                    <div className="sub_menu_title">대화 하기</div>
                    <div className="sub_dropdown">
                        <div onClick={() => { navigate('/SelectAi') }}>대화 신청</div>
                        <div>감정 일기</div>
                        <div>나의 캘린더</div>
                    </div>
                </div>

                <div className="sub_menu_item">
                    <div className="sub_menu_title">랭 킹</div>
                    <div className="sub_dropdown">
                        <div>순위</div>
                    </div>
                </div>
                <div className="sub_menu_item">
                    <div className="sub_menu_title">커뮤니티</div>
                    <div className="sub_dropdown">
                        <div onClick={() => { navigate('/BoardList') }}>고민게시판</div>
                        <div>문의사항</div>
                    </div>
                </div>
                <div className="sub_menu_item">
                    <div className="sub_menu_title">이용안내</div>
                    <div className="sub_dropdown">
                        <div onClick={() => { navigate('/Hellow') }}>인사말</div>
                        <div onClick={() => { navigate('/Info') }}>상담센터</div>
                        <div>결제 이용안내</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SubMenu;