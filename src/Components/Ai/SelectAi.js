import React from "react";
import { useNavigate } from "react-router-dom";

import "./SelectAi.css";

import ai1 from "../../Img/필필.png";
import ai2 from "../../Img/로로.png";
import ai3 from "../../Img/그그.png";


function SelectAi() {

    const navigate = useNavigate();


    // =====================================================
    // AI 선택
    // =====================================================

    const handleFeel = () => {
        navigate("/feel");
    };


    const handleLo = () => {
        navigate("/lo");
    };


    const handleG = () => {
        navigate("/g");
    };


    return (

        <div className="select-ai">

            {/* =================================================
                AI 선택 영역
            ================================================= */}

            <div className="select-ai-container">


                {/* =================================================
                    필
                ================================================= */}

                <div
                    className="ai-card"
                    onClick={handleFeel}
                >

                    <div className="ai-image-box">

                        <img
                            src={ai1}
                            alt="필"
                            className="ai-image"
                        />

                    </div>


                    <div className="ai-info">

                        <h3>
                            필
                        </h3>

                        <p>
                            편안하게 이야기를 들어주는
                            <br />
                            따뜻한 AI입니다.
                        </p>

                    </div>


                    <div className="ai-example">

                        <div className="example-user">
                            나 오늘 너무 힘들었어...
                        </div>

                        <div className="example-ai">
                            무슨 일이 있었어? 괜찮아.
                            <br />
                            천천히 이야기해도 괜찮아.
                        </div>

                    </div>

                </div>


                {/* =================================================
                    로
                ================================================= */}

                <div
                    className="ai-card"
                    onClick={handleLo}
                >

                    <div className="ai-image-box">

                        <img
                            src={ai2}
                            alt="로"
                            className="ai-image"
                        />

                    </div>


                    <div className="ai-info">

                        <h3>
                            로
                        </h3>

                        <p>
                            즐겁고 밝은 분위기로
                            <br />
                            대화할 수 있는 AI입니다.
                        </p>

                    </div>


                    <div className="ai-example">

                        <div className="example-user">
                            오늘 재미있는 일이 있었어!
                        </div>

                        <div className="example-ai">
                            정말?
                            <br />
                            무슨 일이었는데?
                            나한테도 이야기해줘!
                        </div>

                    </div>

                </div>


                {/* =================================================
                    그
                ================================================= */}

                <div
                    className="ai-card"
                    onClick={handleG}
                >

                    <div className="ai-image-box">

                        <img
                            src={ai3}
                            alt="그"
                            className="ai-image"
                        />

                    </div>


                    <div className="ai-info">

                        <h3>
                            그
                        </h3>

                        <p>
                            차분하게 고민을 나누고
                            <br />
                            함께 생각해주는 AI입니다.
                        </p>

                    </div>


                    <div className="ai-example">

                        <div className="example-user">
                            요즘 고민이 하나 있어.
                        </div>

                        <div className="example-ai">
                            괜찮아.
                            <br />
                            서두르지 말고 천천히 이야기해봐.
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default SelectAi;