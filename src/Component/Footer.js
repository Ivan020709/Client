import React from 'react'
import { useNavigate } from 'react-router-dom'

function Footer() {
    const navigate = useNavigate()

    return (
        <div className='footer' style={{color:'white', background:'gray'}}>
            <div className='row'>
                <div className='col'>이용약관</div>
                <div className='col'>개인정보취급방침</div>
            </div>
            <div className='row'>
                <div className='col'>3</div>
                <div className='col'>4</div>
            </div>
            <div className='row'>
                <div className='col'>5</div>
            </div>
        </div>
    )
}

export default Footer