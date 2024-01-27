import './Header.scss'
import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import UserMenu from './menu/UserMenu';
import APIapp from '../APIapp/APIapp';
import { getCookie } from '../../utils/api';
import { Link } from 'react-router-dom';

function Header(){

    const navigate = useNavigate()
    const [user, setUser] = useState({
        "fullName": "string",
        "id": 0,
        "image": "",
        "latitude": 0,
        "longitude": 0,
        "password": "string",
        "username": "string"
      })
    const [isLogin, setIsLogin] = useState(false)
    const [imageSrc, setImageSrc] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-BiIorxpeD_vgAzBTgpx9vd6EQezMODouWZWDbv8wY55bX4z56X4RuBEdeVbrYaCyxkc&usqp=CAU")
    const accessToken = getCookie('Authorization').substring(6, getCookie('Authorization').length)

    useEffect(()=>{
        async function fetchData(){
            const userId= await APIapp.get(`/auth/profile`, {
                params: {
                    Authorization: `${accessToken}`,
                },
            })
            const userInfo = await APIapp.get(`/auth/user/info?id=${userId.data}`)
            setUser(userInfo.data)
            console.log(userInfo)
        }
        const authentication = getCookie('Authorization');
        if(authentication!==""){
            fetchData();
            setIsLogin(true)
            if(user.image!==""){
                setImageSrc( user.image)
            }
        }
    },[])

    const handleToLogin = ()=>{
        navigate('/login')
    };

    const handleToSignUp = ()=>{
        navigate('/signup')
    }

    const [showUserMenu, setShowUserMenu] = useState(false);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };
    const handleToPost=()=>{
        navigate('/user/create')
    }
    const handleToHome =()=>{
        navigate('/')
        window.location.reload()
    }

    const logoPath = require('./logo.png')

    return(
        <div className='header'>
            <div className='navbar-custom'>
                <div className='left'>
                    <img src={logoPath} alt="" className='logo'/>
                </div>
                {!isLogin?<div className='right'>
                    <button className='signup' onClick={handleToSignUp}>Đăng Ký</button>
                    <button className='login' onClick={handleToLogin}>Đăng nhập</button>    
                    <button className='post' onClick={handleToLogin}>Đăng tin <AddCircleOutlineIcon className='icon'/></button>
                </div>:
                <div className='right'>
                    <div className="user-info" onClick={toggleUserMenu}>
                        <span className="user-name">{user.fullName}</span>
                        <img src={imageSrc} alt="" className="user-avatar" />
                        {showUserMenu && <UserMenu />} {/* Show UserMenu component when showUserMenu is true */}
                    </div>
                    <button className='post' onClick={handleToPost}>Đăng tin <AddCircleOutlineIcon className='icon'/></button>
                </div>}

            </div>
            <div className='menubar'>
                <ul>
                    <li onClick={handleToHome}>Trang chủ</li>
                    <Link to={`/find-near-stop`}><li>Tìm kiếm theo tuyến xe buýt</li></Link>
                    <Link to={`/detail-search`}><li>Tìm kiếm nâng cao</li></Link>
                    <Link to={`/find-by-map`}><li>Tìm kiếm bằng bản đồ</li></Link>
                </ul>
            </div>
        </div>
    )
}

export default Header;