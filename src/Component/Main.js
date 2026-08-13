import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import banner1 from '../Img/banner.png';
import banner2 from '../Img/banner2.png';
import banner3 from '../Img/banner3.png';
import banner4 from '../Img/banner4.png';

function Main() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    };

    return (
        <div style={{width: '100%',maxWidth: '1400px',minHeight: '917px',display: 'flex',flexDirection: 'column',margin: '0 auto'}}>
            <div style={{flex: '1',display: 'flex',marginTop: '10px'}}>
                <div style={{flex: '1',overflow: 'hidden',borderRadius: '20px'}}>
                    <Slider {...settings}>
                        <div>
                            <img src={banner1} alt="메인 배너 1"style={{width: '100%',height: '600px', objectFit: 'cover'}}/>
                        </div>
                        <div>
                            <img src={banner2}alt="메인 배너 2"style={{ width: '100%',height: '600px',objectFit: 'cover'}}/>
                        </div>
                        <div>
                            <img
                                src={banner3}alt="메인 배너 3"style={{width: '100%',height: '600px',objectFit: 'cover'}}/>
                        </div>
                        <div>
                            <img src={banner4}alt="메인 배너 4"style={{width: '100%',height: '600px',objectFit: 'cover'}}/>
                        </div>
                    </Slider>
                </div>
            </div>
            <div style={{border: '3px solid yellow',flex: '5',display: 'flex'}}>
                <div style={{ border: '1px solid orange',flex: '1'}}>content1</div>
                <div style={{border: '1px solid orange',flex: '1'}}>content2</div>
                <div style={{border: '1px solid orange', flex: '1'}}>content3</div>
            </div>

        </div>
    );
}

export default Main;
