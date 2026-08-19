import React from "react";
import { useNavigate } from "react-router-dom";

import characterMap from "../../Img/필로그4.png";

import "./Map.css";

export default function Map() {
  const navigate = useNavigate();

  // ==========================================
  // 회사 정보
  // ==========================================
  const company = {
    name: "Feelog",
    address: "서울 특별시 구로구 경인로 557",
    detailAddress: "삼영빌딩 4층",
    phone: "02-0000-0000",
    email: "feelog@example.com",
    subway: "구로역 2번, 3번 출구에서 도보 약 3분",
  };

  // Feelog 시작하기
  const handleStart = () => {
    navigate("/memberLogin");
  };

  // 카카오맵 열기
  const handleMap = () => {
    const address = encodeURIComponent(
      `${company.address} ${company.detailAddress}`
    );

    window.open(
      `https://map.kakao.com/?q=${address}`,
      "_blank"
    );
  };

  return (
    <main className="map">

      {/* =====================================================
          1. Hero
          ===================================================== */}

      <section className="mapHero">

        <div className="mapHeroText">

          <span className="mapBadge">
            📍 CONTACT & LOCATION
          </span>

          <h1>
            Feelog와 함께하는 곳
          </h1>

          <p>
            우리의 이야기가 시작되는 곳으로
            <br />
            여러분을 초대합니다.
          </p>

        </div>


        <div className="mapHeroCharacter">

          <div className="mapCircle"></div>

          <img
            src={characterMap}
            alt="Feelog 캐릭터"
          />

          <div className="mapHeart">
            ♥
          </div>

        </div>

      </section>


      {/* =====================================================
          2. 회사 위치
          ===================================================== */}

      <section className="mapSection">

        <div className="mapSectionHeading">

          <small>OUR LOCATION</small>

          <h2>
            Feelog를 찾아오세요
          </h2>

          <p>
            Feelog가 여러분을 기다리고 있어요.
          </p>

        </div>


        <div className="mapBox">

          {/* 지도 영역 */}

          <div className="fakeMap">

            <div className="mapGrid"></div>

            <div className="mapRoad road1"></div>
            <div className="mapRoad road2"></div>
            <div className="mapRoad road3"></div>

            <div className="mapBuilding building1">
              FEEL
            </div>

            <div className="mapBuilding building2"></div>
            <div className="mapBuilding building3"></div>

            <div className="mapPin">

              <div className="pinBubble">
                Feelog
              </div>

              <div className="pinIcon">
                📍
              </div>

            </div>

            <div className="mapText">
              Feelog
            </div>

          </div>


          {/* 회사 정보 */}

          <div className="mapInfoCard">

            <span className="infoLabel">
              FEELLOG
            </span>

            <h3>
              Feelog
            </h3>

            <p className="infoDescription">
              마음을 이야기하고 기록하는
              <br />
              감정 일기 서비스 Feelog입니다.
            </p>


            <div className="companyInfo">

              {/* 주소 */}

              <div className="companyInfoItem">

                <span className="companyIcon">
                  📍
                </span>

                <div>

                  <small>
                    ADDRESS
                  </small>

                  <p>
                    {company.address}
                    <br />
                    {company.detailAddress}
                  </p>

                </div>

              </div>


              {/* 지하철 */}

              <div className="companyInfoItem">

                <span className="companyIcon">
                  🚇
                </span>

                <div>

                  <small>
                    SUBWAY
                  </small>

                  <p>
                    {company.subway}
                  </p>

                </div>

              </div>


              {/* 전화 */}

              <div className="companyInfoItem">

                <span className="companyIcon">
                  ☎
                </span>

                <div>

                  <small>
                    PHONE
                  </small>

                  <p>
                    {company.phone}
                  </p>

                </div>

              </div>


              {/* 이메일 */}

              <div className="companyInfoItem">

                <span className="companyIcon">
                  ✉
                </span>

                <div>

                  <small>
                    EMAIL
                  </small>

                  <p>
                    {company.email}
                  </p>

                </div>

              </div>

            </div>


            <button
              className="mapButton"
              onClick={handleMap}
            >
              카카오맵에서 길찾기
              <span>→</span>
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          3. 오시는 길
          ===================================================== */}

      <section className="mapSection waySection">

        <div className="mapSectionHeading">

          <small>
            HOW TO GET HERE
          </small>

          <h2>
            편하게 찾아오세요
          </h2>

          <p>
            다양한 방법으로 Feelog를 찾아오실 수 있어요.
          </p>

        </div>


        <div className="wayGrid">

          {/* 지하철 */}

          <article className="wayCard">

            <div className="wayIcon">
              🚇
            </div>

            <span>
              SUBWAY
            </span>

            <h3>
              지하철 이용
            </h3>

            <p>
              구로역 2번, 3번 출구에서
              <br />
              약 3분 정도 걸어오시면 됩니다.
            </p>

          </article>


          {/* 버스 */}

          <article className="wayCard">

            <div className="wayIcon">
              🚌
            </div>

            <span>
              BUS
            </span>

            <h3>
              버스 이용
            </h3>

            <p>
              구로역.구로기계공구상가 정류장에서 하차 후
              <br />
              도보 약 5분 거리입니다.
            </p>

          </article>


          {/* 자동차 */}

          <article className="wayCard">

            <div className="wayIcon">
              🚗
            </div>

            <span>
              CAR
            </span>

            <h3>
              자가용 이용
            </h3>

            <p>
              건물 내 주차장을
              <br />
              이용하실 수 있습니다.
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          4. 회사 정보
          ===================================================== */}

      <section className="companySection">

        <div className="companySectionInner">

          <div>

            <small>
              ABOUT FEELLOG
            </small>

            <h2>
              마음이 쉬어갈 수 있는 곳,
              <br />
              Feelog
            </h2>

            <p>
              여러분의 이야기를 편하게 들을 수 있도록
              <br />
              Feelog가 언제나 함께할게요.
            </p>

          </div>


          <div className="companyMiniCard">

            <div>
              <span>
                COMPANY
              </span>

              <strong>
                Feelog
              </strong>
            </div>


            <div>
              <span>
                ADDRESS
              </span>

              <strong>
                {company.address}
              </strong>
            </div>


            <div>
              <span>
                CONTACT
              </span>

              <strong>
                {company.phone}
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          5. 마지막 CTA
          ===================================================== */}

      <section className="mapBottom">

        <div className="mapBottomCharacter">

          <img
            src={characterMap}
            alt="Feelog 캐릭터"
          />

        </div>


        <div className="mapBottomText">

          <span>
            오늘도 Feelog와 함께
          </span>

          <strong>
            나의 마음을 따뜻하게 기록해보세요.
          </strong>

          <button onClick={handleStart}>
            Feelog 시작하기
            <span>→</span>
          </button>

        </div>

      </section>

    </main>
  );
}