import './Login.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../api/useAuth';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    username: yup.string().required('Số điện thoại không được bỏ trống'),
    password: yup.string().required('Mật khẩu không được bỏ trống'),
});

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

    const navigate = useNavigate();

    const handleMutationEvent = {
        onSuccess: () => {
            navigate('/');
            window.location.reload()
        },
        onError: () => {
            alert('error');
        },
    };

    const { mutate: login } = useLogin(handleMutationEvent);

    const handleLogin = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            console.log(formData)
            login({ username: formData.username, password: formData.password });
            console.log('Dữ liệu hợp lệ:', formData);
          } catch (validationErrors) {
            // Nếu có lỗi validate, cập nhật errors state với thông tin lỗi
            const newErrors = {};
            validationErrors.inner.forEach((error) => {
              newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="loginform">
                <h2>Đăng nhập</h2>
                <div className='username'>
                    <label>Số điện thoại:</label>
                    <input type="username" name="username" value={formData.username} onChange={handleChange} />
                    {errors.username && <span>{errors.username}</span>}
                </div>
                <div className='password'>
                    <label>Mật khẩu:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <span>{errors.password}</span>}
                </div>
                <button className='loginbut' onClick={handleLogin}>Đăng nhập</button>
            </div>
        </div>
    );
}

export default Login;