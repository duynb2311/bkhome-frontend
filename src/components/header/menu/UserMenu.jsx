import React from 'react';
import './UserMenu.scss';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../api/useAuth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link } from 'react-router-dom';

const UserMenu = () => {
    const navigate = useNavigate();

    const handleMutationEvent = {
        onSuccess: () => {
            navigate('/');
        },
        onError: () => {
            alert('error');
        },
    };

    const { mutate: logout } = useLogout(handleMutationEvent);

    const handleLogout = () => {
        logout()
    };


    return (
        <div className="user-menu">
        <ul>
            <li><PersonIcon fontSize="large" className='menu-icon'/>Thông tin cá nhân</li>
            <Link to={`/user/posts`}><li><ListAltIcon fontSize="large" className='menu-icon'/>Quản lý tin đăng</li></Link>
            <Link to={`/user/saved-post`}><li><FavoriteBorderIcon fontSize="large" className='menu-icon'/>Tin đã lưu</li></Link>
            <li onClick={handleLogout}><LogoutIcon fontSize="large" className='menu-icon'/>Đăng xuất</li>
        </ul>
        </div>
    );
};

export default UserMenu;