import './login-manager.css'

function LoginManager(){
    return(
        <div className='login-manager'>
            <div className="login-form mx-auto text-center rounded bg-white shadow overflow-hidden">
                <form method="POST" className="">
                    <h4 className="bg-gray-900 text-white py-3">
                        ADMIN LOGIN PANEL
                    </h4>
                    <div className="p-6">
                        <div className="mb-3">
                            <input name="admin_name" required="" type="text" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none text-center " placeholder="Admin name" />
                        </div>
                        <div className="mb-3">
                            <input name="admin_password" required="" type="password" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none text-center" placeholder="Password" />
                        </div>
                        <button name="login" type="submit" className="bg-black inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-white custom-bg shadow-none" >
                            LOGIN
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default LoginManager;