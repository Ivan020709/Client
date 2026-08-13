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
                        <div>대화 신청</div>
                        <div>감정 일기</div>
                        <div>나의 캘린더</div>
                    </div>
                </div>

                <div className="sub_menu_item">
                    <div className="sub_menu_title">오늘의 한줄</div>
                    <div className="sub_dropdown">
                        <div>한줄평</div>
                    </div>
                </div>
                <div className="sub_menu_item">
                    <div className="sub_menu_title">커뮤니티</div>
                    <div className="sub_dropdown">
                        <div>랭킹</div>
                        <div onClick={() => { navigate('/BoardList') }}>고민게시판</div>
                        <div>문의사항</div>
                    </div>
                </div>
                <div className="sub_menu_item">
                    <div className="sub_menu_title">이용안내</div>
                    <div className="sub_dropdown">
                        <div>인사말</div>
                        <div>결제</div>
                        <div>상담센터</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SubMenu;