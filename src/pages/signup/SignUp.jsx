import './SignUp.scss'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../api/useAuth';
import * as yup from 'yup';
import APIapp from '../../components/APIapp/APIapp';

const validationSchema = yup.object().shape({
    fullName: yup.string().required('*Tên không được bỏ trống'),
    username: yup.string().required('*Số điện thoại không được bỏ trống'),
    password: yup.string().required('*Mật khẩu không được bỏ trống'),
});

function SignUp(){

    const [formData, setFormData] = useState({
        fullName: '',
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

    const handleSignup = async () => {
        console.log(formData)
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            console.log(formData)
            try{
                const result = await APIapp.post(`/auth/signup`,formData)
                console.log(result)
                navigate('/')
            }catch(e){
                window.alert('Số điện thoại đã được sử dụng!')
            }
          } catch (validationErrors) {
            // Nếu có lỗi validate, cập nhật errors state với thông tin lỗi
            const newErrors = {};
            validationErrors.inner.forEach((error) => {
              newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
    };

    return(
        <div className='signup-wrapper'>
            <div className='signupform'>
                <h2>Đăng Ký</h2>
                <div className='name'>
                    <label>Tên đầy đủ:</label>
                    <input type="name" name="fullName" value={formData.fullName} onChange={handleChange} />
                    {errors.fullName && <span>{errors.fullName}</span>}
                </div>
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
                <button className='loginbut' onClick={handleSignup}>Đăng ký</button>
            </div>
        </div>
    )
}

export default SignUp;