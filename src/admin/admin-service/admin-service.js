import { Link } from 'react-router-dom';

function AdminLogin(){
    return(
        <div className="admin-login">
            <div className='header'>
                <div className="logo my-6 w-[15%] text-center text-xl font-semibold cursor-pointer">
                    <Link to={"/"}>TravelVN.</Link> 
                </div>
            </div>
            <div className=''>
                <div className='grid grid-cols-2 w-[80%] gap-x-4 gap-y-7 mx-auto my-24'>
                    <div className='bg-gray-100 basis-1/2 h-24 rounded-lg border-solid border-2 border-black cursor-pointer flex items-center justify-center hover:bg-[rgba(28,41,48,1)] hover:text-white duration-100'>
                        <p className='font-medium text-lg uppercase'>nhân viên kiểm duyệt dịch vụ</p>
                    </div>
                    <div className='bg-gray-100 basis-1/2 h-24 rounded-lg border-solid border-2 border-black cursor-pointer flex items-center justify-center hover:bg-[rgba(28,41,48,1)] hover:text-white duration-100'>
                        {/* <p className='font-medium text-lg uppercase'>Quản trị viên</p> */}
                        <p className='font-medium text-lg uppercase'><Link to={"/dashboard-admin-hotel"}>Quản trị viên</Link> </p>
                    </div>
                    <div className='bg-gray-100 basis-1/2 h-24 rounded-lg border-solid border-2 border-black cursor-pointer flex items-center justify-center hover:bg-[rgba(28,41,48,1)] hover:text-white duration-100'>
                        {/* <p className='font-medium text-lg uppercase'><Link to={"/login-manager"}>nhân viên quản lý dịch vụ</Link> </p> */}
                        <p className='font-medium text-lg uppercase'><Link to={"/dashboard-hotel"}>nhân viên quản lý dịch vụ</Link> </p>
                    </div>
                    <div className='bg-gray-100 basis-1/2 h-24 rounded-lg border-solid border-2 border-black cursor-pointer flex items-center justify-center hover:bg-[rgba(28,41,48,1)] hover:text-white duration-100'>
                        <p className='font-medium text-lg uppercase'>Hướng dẫn viên</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminLogin;