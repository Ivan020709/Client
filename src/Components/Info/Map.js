import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import characterMap from "../../Img/필로그4.png";

import "./Map.css";

export default function Map() {
  const navigate = useNavigate();

  // ==========================================
  // 카카오맵을 표시할 DOM
  // ==========================================

  const mapRef = useRef(null);

  // ==========================================
  // 회사 정보
  // ==========================================

  const company = {
    name: "Feelog",

    // 지도 좌표를 찾을 때 사용할 주소
    address: "서울특별시 구로구 경인로 557",

    // 화면에 표시할 상세 주소
    detailAddress: "삼영빌딩 4층",

    phone: "02-0000-0000",

    email: "feelog@example.com",

    subway: "구로역 2번, 3번 출구에서 도보 약 3분",
  };

  // ==========================================
  // Feelog 시작하기
  // ==========================================

  const handleStart = () => {
    navigate("/memberLogin");
  };

  // ==========================================
  // 카카오맵에서 길찾기
  // ==========================================

  const handleMap = () => {
    const address = encodeURIComponent(
      `${company.address} ${company.detailAddress}`
    );

    window.open(
      `https://map.kakao.com/?q=${address}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // 카카오맵 생성
  // ==========================================

  useEffect(() => {
    const scriptId = "kakao-map-sdk";

    let mapInstance = null;
    let markerInstance = null;
    let infoWindowInstance = null;
    let resizeHandler = null;

    // ==========================================
    // 실제 지도 초기화
    // ==========================================

    const initMap = () => {
      // ----------------------------------------
      // SDK 확인
      // ----------------------------------------

      if (!window.kakao || !window.kakao.maps) {
        console.error(
          "카카오맵 SDK가 정상적으로 로드되지 않았습니다."
        );
        return;
      }

      // ----------------------------------------
      // 지도 DOM 확인
      // ----------------------------------------

      if (!mapRef.current) {
        console.error(
          "카카오맵을 표시할 DOM을 찾을 수 없습니다."
        );
        return;
      }

      // ----------------------------------------
      // 주소 검색 객체 생성
      // ----------------------------------------

      const geocoder =
        new window.kakao.maps.services.Geocoder();

      // ----------------------------------------
      // 주소 → 좌표 변환
      //
      // company.address를 기준으로
      // 정확한 좌표를 카카오에서 가져옵니다.
      // ----------------------------------------

      geocoder.addressSearch(
        company.address,
        (result, status) => {
          // --------------------------------------
          // 주소 검색 실패
          // --------------------------------------

          if (
            status !==
            window.kakao.maps.services.Status.OK
          ) {
            console.error(
              "주소를 좌표로 변환하지 못했습니다.",
              status
            );

            return;
          }

          // --------------------------------------
          // 검색 결과 확인
          // --------------------------------------

          if (!result || result.length === 0) {
            console.error(
              "주소 검색 결과가 없습니다."
            );

            return;
          }

          // --------------------------------------
          // 카카오가 반환한 좌표
          //
          // x = 경도
          // y = 위도
          // --------------------------------------

          const longitude = Number(result[0].x);
          const latitude = Number(result[0].y);

          console.log(
            "Feelog 좌표:",
            latitude,
            longitude
          );

          // --------------------------------------
          // 카카오맵 좌표 생성
          // --------------------------------------

          const feelogPosition =
            new window.kakao.maps.LatLng(
              latitude,
              longitude
            );

          // --------------------------------------
          // 지도 생성
          // --------------------------------------

          mapInstance =
            new window.kakao.maps.Map(
              mapRef.current,
              {
                center: feelogPosition,

                // 숫자가 작을수록 확대
                // 3~4 정도가 회사 위치 확인하기 좋음
                level: 4,
              }
            );

          // --------------------------------------
          // 확대 / 축소 컨트롤
          // --------------------------------------

          const zoomControl =
            new window.kakao.maps.ZoomControl();

          mapInstance.addControl(
            zoomControl,
            window.kakao.maps.ControlPosition.RIGHT
          );

          // --------------------------------------
          // Feelog 마커
          // --------------------------------------

          markerInstance =
            new window.kakao.maps.Marker({
              position: feelogPosition,
            });

          markerInstance.setMap(mapInstance);

          // --------------------------------------
          // 마커 정보창
          // --------------------------------------

          infoWindowInstance =
            new window.kakao.maps.InfoWindow({
              content: `
                <div
                  style="
                    padding: 10px 14px;
                    color: #4f4944;
                    font-family: 'Noto Sans KR', sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    white-space: nowrap;
                  "
                >
                  💗 Feelog
                </div>
              `,
            });

          infoWindowInstance.open(
            mapInstance,
            markerInstance
          );

          // --------------------------------------
          // 지도 중심 다시 설정
          // --------------------------------------

          mapInstance.setCenter(
            feelogPosition
          );

          // --------------------------------------
          // 브라우저 크기 변경
          // --------------------------------------

          resizeHandler = () => {
            if (!mapInstance) return;

            mapInstance.relayout();

            mapInstance.setCenter(
              feelogPosition
            );
          };

          window.addEventListener(
            "resize",
            resizeHandler
          );
        }
      );
    };

    // ==========================================
    // 이미 SDK가 로드되어 있는 경우
    // ==========================================

    if (
      window.kakao &&
      window.kakao.maps
    ) {
      window.kakao.maps.load(initMap);

      return () => {
        if (resizeHandler) {
          window.removeEventListener(
            "resize",
            resizeHandler
          );
        }
      };
    }

    // ==========================================
    // SDK script 찾기
    // ==========================================

    let script =
      document.getElementById(scriptId);

    // ==========================================
    // SDK script가 없으면 생성
    // ==========================================

    if (!script) {
      script =
        document.createElement("script");

      script.id = scriptId;

      /*
       * 중요
       *
       * 여기에 카카오디벨로퍼스
       * JavaScript 키를 입력합니다.
       *
       * libraries=services
       * → 주소를 좌표로 변환하기 위해 필요합니다.
       */

      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=bc6dfe332f1f1da9441c1886ce6bcbad&autoload=false&libraries=services";

      script.async = true;

      document.head.appendChild(script);
    }

    // ==========================================
    // SDK 로드 성공
    // ==========================================

    script.onload = () => {
      if (
        window.kakao &&
        window.kakao.maps
      ) {
        window.kakao.maps.load(initMap);
      } else {
        console.error(
          "카카오맵 SDK는 로드되었지만 kakao.maps를 찾을 수 없습니다."
        );
      }
    };

    // ==========================================
    // SDK 로드 실패
    // ==========================================

    script.onerror = () => {
      console.error(
        "카카오맵 SDK 로드에 실패했습니다."
      );
    };

    // ==========================================
    // cleanup
    // ==========================================

    return () => {
      if (resizeHandler) {
        window.removeEventListener(
          "resize",
          resizeHandler
        );
      }

      if (markerInstance) {
        markerInstance.setMap(null);
      }

      if (infoWindowInstance) {
        infoWindowInstance.close();
      }

      mapInstance = null;
      markerInstance = null;
      infoWindowInstance = null;
    };
  }, []);

  // ==========================================
  // 화면
  // ==========================================

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

          <small>
            OUR LOCATION
          </small>

          <h2>
            Feelog를 찾아오세요
          </h2>

          <p>
            Feelog가 여러분을 기다리고 있어요.
          </p>

        </div>


        <div className="mapBox">

          {/* =================================================
              실제 카카오맵
          ================================================= */}

          <div
            className="realKakaoMap"
            ref={mapRef}
          />


          {/* =================================================
              회사 정보
          ================================================= */}

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