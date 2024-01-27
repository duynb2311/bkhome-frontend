import React, { useEffect, useState,useRef } from 'react';
import './DetailSearch.scss'
import APIapp from '../../components/APIapp/APIapp';
import {useNavigate} from 'react-router-dom'


function DetailSearch() {
    const selectRef = useRef({});
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        "address": "",
        "bathroom": "",
        "bedroom": "",
        "busNum": "",
        "distance": 0,
        "feature1": "",
        "feature2": "",
        "feature3": "",
        "feature4": "",
        "feature5": "",
        "feature6": "",
        "furniture1": "",
        "furniture2": "",
        "furniture4": "",
        "furniture5": "",
        "furniture6": "",
        "kitchen": "",
        "livingroom": "",
        "maxArea": 1000,
        "maxDeposit": 100000000,    
        "maxElectricCost": 100000,
        "maxRentFee": 100000000,
        "maxWaterCost": 1000000,
        "minArea": 0,
        "minRentFee": 0,
        "nonglanh": "",
        "trainId": 0,
        "type": ""
    })
    const [busNum, setBusnum] = useState([])
    var pixelRatio = window.devicePixelRatio;
    console.log("Độ phân giải pixel thực tế: " + pixelRatio);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    //address handle
    const [districts, setDistricts] = useState([])
    const [provinces, setProvinces] =useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState({name: "", code: ""});
    const [district, setDistrict] = useState({name: "", code: ""});
    const [ward, setWard] = useState('');
    const [street, setStreet] = useState('');
    useEffect(()=>{
        const fetchdata = async ()=>{
            const provinceRes = await APIapp.get('/province')
            setProvinces(provinceRes.data)
            const busNum = await APIapp.get(`/stops/allbusnum`)
            setBusnum(busNum.data)
        }
        fetchdata()
    },[])
    useEffect(()=>{
        const fetchdata = async ()=>{
            setDistrict({...district, name:"", code : ""});
            if(province.code!==""){
                const districtRes = await APIapp.get(`/district?provinceCode=${province.code}`)
                setDistricts(districtRes.data)
            }else{
                setDistricts([])
            }
        }
        fetchdata()
    },[province])
    useEffect(()=>{
        const fetchdata = async ()=>{
            if(district.code!==""){
                const wardRes = await APIapp.get(`/ward?districtCode=${district.code}`)
                setWards(wardRes.data)
            }else{
                setWards([])
                setWard('')
            }
        }
        fetchdata()
    },[district])
    useEffect(()=>{
        if(ward!=='') {
            if(street!=='')setFormData({...formData, address: `${street}, ${ward}, ${district.name}, ${province.name}`})
            else setFormData({...formData, address: `${ward}, ${district.name}, ${province.name}`})
        }else{
            if(street!== '') setFormData({...formData, address: `${street}, ${district.name}, ${province.name}`})
            else setFormData({...formData, address: `${district.name}, ${province.name}`})
        }
    },[province, district, ward, street])

    const handleProvinceChange = (event) => {
        const selectElement = selectRef.current[1];
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const code = selectedOption.getAttribute('data-code');
        setProvince({...province, name:event.target.value, code : code});
    };
    const handleDistrictChange = (event) => {
        const selectElement = selectRef.current[2];
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const code = selectedOption.getAttribute('data-code');
        setDistrict({...district, name:event.target.value, code : code});
    };
    const handleWardChange = (event) => {
        setWard(event.target.value);
    };

    //structure handle
    const [structureoptions, setStructureOptions] = useState({
        bedroom1: false,
        bedroom2: false,
        bedroom3: false,
        kitchen: false,
        livingRoom: false,
        bathroom: false,
    });

    const handleStructureChange = (event) => {
        const { name, checked } = event.target;
        setStructureOptions({ ...structureoptions, [name]: checked });
    }
    useEffect(()=>{
        const kitchenValue = structureoptions.kitchen ? '1B' : 'B';
        const livingRoomValue = structureoptions.livingRoom ? '1K' : 'K';
        const bathroomValue = structureoptions.bathroom ? '1VS' : 'VS';
        setFormData({...formData, kitchen:kitchenValue, livingroom:livingRoomValue, bathroom:bathroomValue});

    },[structureoptions])

    //furniture handle
    const[furnitureOption, setFurnitureOption]= useState({
        dieuhoa: false,
        tulanh: false,
        nonglanh: false,
        maygiat: false,
        bepga: false,
        bepdien: false,
    })
    const handleFurnitureChange= (event)=>{
        const { name, checked } = event.target;
        setFurnitureOption({...furnitureOption, [name]:checked})
    }
    useEffect(()=>{
        const dieuhoaValue = furnitureOption.dieuhoa ? '1DH' : 'DH';
        const tulanhValue = furnitureOption.tulanh ? '1TL' : 'TL';
        const nonglanhValue = furnitureOption.nonglanh ? '1NL' : 'NL';
        const maygiatValue = furnitureOption.maygiat ? '1MG' : 'MG';
        const bepgaValue = furnitureOption.bepga ? '1BG' : 'BG';
        const bepdienValue = furnitureOption.bepdien ? '1BD' : 'BD';
        setFormData({...formData, furniture1: dieuhoaValue, furniture2: tulanhValue, nonglanh:nonglanhValue, furniture4:maygiatValue, furniture5:bepgaValue, furniture6:bepdienValue});
    },[furnitureOption])


    //feature handle
    const [featureOption, setFeatureOption] = useState({
        nhaxe: false,
        thangmay: false,
        bancong: false,
        santhuong: false,
        gacxep: false,
    })
    const handleFeatureChange = (event)=>{
        const { name, checked } = event.target;
        setFeatureOption({...featureOption, [name]:checked})
    }
    useEffect(()=>{
        const nhaxeValue = featureOption.nhaxe ? '1NX' : 'NX';
        const thangmayValue = featureOption.thangmay ? '1TM' : 'TM';
        const bancongValue = featureOption.bancong ? '1BC' : 'BC';
        const santhuongValue = featureOption.santhuong ? '1ST' : 'ST';
        const gacxepValue = featureOption.gacxep ? '1GX' : 'GX';
        setFormData({...formData, feature1:nhaxeValue, feature2: thangmayValue, feature3: bancongValue, feature4: santhuongValue, feature5:gacxepValue});
    },[featureOption])

    const handleSearch = ()=>{
        let url =`/detail-search/result?`
        console.log(formData.address)
        url+=`address=${encodeURIComponent(formData.address)}`
        url+=`&src1=${formData.bathroom}`
        url+=`&src2=${formData.bedroom}`
        url+=`&src3=${formData.busNum}`
        url+=`&src4=${formData.distance}`
        url+=`&src5=${formData.feature1}`
        url+=`&src6=${formData.feature2}`
        url+=`&src7=${formData.feature3}`
        url+=`&src8=${formData.feature4}`
        url+=`&src9=${formData.feature5}`
        url+=`&src10=${formData.feature6}`
        url+=`&src11=${formData.furniture1}`
        url+=`&src12=${formData.furniture2}`
        url+=`&src13=${formData.furniture4}`
        url+=`&src14=${formData.furniture5}`
        url+=`&src15=${formData.furniture6}`
        url+=`&src16=${formData.kitchen}`
        url+=`&src17=${formData.livingroom}`
        url+=`&src18=${formData.maxArea}`
        url+=`&src19=${formData.maxDeposit}`
        url+=`&src20=${formData.maxElectricCost}`
        url+=`&src21=${formData.maxRentFee}`
        url+=`&src22=${formData.maxWaterCost}`
        url+=`&src23=${formData.minArea}`
        url+=`&src24=${formData.minRentFee}`
        url+=`&src25=${formData.nonglanh}`
        url+=`&src26=${formData.trainId}`
        url+=`&src27=${formData.type}`

        navigate(url)
    }


    return(
        <div className='search-form'>
            <h1>Tìm kiếm chi tiết</h1>
            <div className='address'>
                <h2>Địa chỉ cho thuê</h2>
                <div className='select-address'>
                    <div>
                        <label>Tỉnh/Thành phố</label>
                        <select name="province" id="province" onChange={handleProvinceChange} ref={(ref) => selectRef.current[1] = ref}>
                            <option value="" data-code="">Chọn Tỉnh/TP</option>
                            {provinces.map((province)=>(
                                <option key={province.code} value={province.name} data-code={province.code}>{province.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Quận/Huyện</label>
                        <select name="district" id="district" onChange={handleDistrictChange} ref={(ref) => selectRef.current[2] = ref}>
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map((district)=>(
                                <option key={district.code} value={district.name} data-code={district.code}>{district.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Phường/Xã</label>
                        <select name="ward" id="ward" onChange={handleWardChange}>
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((ward)=>(
                                <option key={ward.code} value={ward.name}>{ward.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className='bus'>
                <h2>Tìm theo tuyến Bus</h2>
                <div>
                    <label>Chọn tuyến Bus</label>
                    <select name="busNum" id="" onChange={handleChange}>
                        <option value="">Tuyến Bus</option>
                        {busNum.map((busNum, index)=>(
                            <option value={busNum}>{busNum}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Chọn khoảng cách tối đa so với điểm dừng</label>
                    <input type="number" name='distance' onChange={handleChange}/>
                </div>
            </div>
            <div className='base-info'>
                <h2>Thông tin cơ bản</h2>
                <div className='infor'>
                    <label>Loại phòng</label>
                    <select name="type" id="type" onChange={(e)=>{setFormData({...formData, type:e.target.value})}}>
                        <option value="">Chọn loại phòng</option>
                        <option value="t1">Phòng trọ chung chủ</option>
                        <option value="t2">Phòng trọ không chung chủ</option>
                        <option value="t3">Chung cư mini</option>
                        <option value="t4">HomeStay sinh viên</option>
                    </select>
                </div>
                <div className='input'>
                    <label>Giá cho thuê từ</label>
                    <div className='cost-input'>
                        <input type="number" name='minRentFee' step="500000" onChange={handleChange}/>
                        <span ><strong>-</strong></span>
                        <input type="number" name='maxRentFee' step="500000" onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá cọc tối đa</label>
                    <div className='cost-input'>
                        <input type="number" name='maxDeposit' step="500000" onChange={handleChange}/>
                        <span>Đồng</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá điện tối đa</label>
                    <div className='cost-input'>
                        <input type="number" name='maxElectricCost' step="1000" onChange={handleChange}/>
                        <span>Đồng/số</span>
                    </div>
                </div>
                <div className='input'>
                    <label>Giá nước tối đa</label>
                    <div className='cost-input'>
                        <input type="number" name='maxWaterCost' step="10000" onChange={handleChange}/>
                        <span>Đồng/tháng</span>
                    </div>
                </div>
            </div>
            <div className='structure'>
                <h2>Cấu trúc phòng</h2>
                <div className='input'>
                    <label>Diện tích từ</label>
                    <div className='area-input'>
                        <input type="number" name='minArea' onChange={handleChange}/>
                        <span><strong>-</strong></span>
                        <input type="number" name='maxArea' onChange={handleChange}/>
                        <span>m<sup>2</sup></span>
                    </div>
                </div>
                <div className='choose-structure'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='kitchen' onChange={handleStructureChange}/>
                        Có bếp
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='livingRoom' onChange={handleStructureChange}/>
                        Có phòng khách
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bathroom' onChange={handleStructureChange}/>
                        Vệ sinh khép kín
                    </label>
                </div>
            </div>
            <div className='furniture'>
                <h2>Nội thất</h2>
                <div className='choose-furniture'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='dieuhoa' onChange={handleFurnitureChange}/>
                        Điều hòa
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='tulanh' onChange={handleFurnitureChange}/>
                        Tủ lạnh
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='nonglanh' onChange={handleFurnitureChange}/>
                        Nóng lạnh
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='maygiat' onChange={handleFurnitureChange}/>
                        Máy giặt
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bepga' onChange={handleFurnitureChange}/>
                        Bếp ga
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bepdien' onChange={handleFurnitureChange}/>
                        Bếp điện
                    </label>
                </div>
            </div>
            <div className='other-feature'>
                <h2>Tiện nghi khác</h2>
                <div className='choose-feature'>
                    <label className="checkbox-label">
                        <input type="checkbox" name='nhaxe' onChange={handleFeatureChange}/>
                        Chỗ để xe
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='thangmay' onChange={handleFeatureChange}/>
                        Thang máy
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='bancong' onChange={handleFeatureChange}/>
                        Ban công
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='santhuong' onChange={handleFeatureChange}/>
                        Sân thượng
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name='gacxep' onChange={handleFeatureChange}/>
                        Gác xép
                    </label>
                </div>
            </div>
            <div className='submit'>
                <button className='searchbut' onClick={handleSearch}>Tìm Kiếm</button>
            </div>
            
        </div>
    )
}

export default DetailSearch