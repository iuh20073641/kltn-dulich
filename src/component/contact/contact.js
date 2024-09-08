function Contact (){
    return(
        <div className="contact">
            <div className="my-5 px-4">
                <h2 className="fw-bold h-font text-center">CONTACT US</h2>
                <div className="h-line bg-gray-900" />
                <p className="text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam quam tempore
                    molestias. Excepturi ad eos fugit quis assumenda dolores odio.
                </p>
            </div>
            <div class="row">
                <div className="lg:w-1/2 pr-4 pl-4 md:w-1/2 mb-5 px-4">
                    <div className="bg-white rounded shadow p-6 ">
                        {/* <iframe className="w-full rounded mb-4" height="320px" src="" loading="lazy" /> */}
                        <h5>Address</h5>
                        <a href="https://www.facebook.com/" target="_blank" className="inline-block text-decoration-none text-gray-900 mb-2" >
                            <i className="bi bi-geo-alt-fill" />
                        </a>
                        <h5 className="mt-4">Call us</h5>
                        <a href="https://www.facebook.com/" className="inline-block mb-2 text-decoration-none text-gray-900">
                            <i className="bi bi-telephone-fill" />
                        </a>
                        <br />
                        <a href="https://www.facebook.com/" className="inline-block text-decoration-none text-gray-900" >
                            <i className="bi bi-telephone-fill" />
                        </a>
                        <h5 className="mt-4">Email</h5>
                        <a href="https://www.facebook.com/" className="inline-block mb-2 text-decoration-none text-gray-900">
                            <i className="bi bi-envelope-fill" />
                        </a>
                        <h5 className="mt-4">Follow us</h5>
                        <div className="flex">
                        <a href="https://www.facebook.com/" className="inline-block text-gray-900 fs-5 me-2">
                            <i className="bi bi-twitter me-1" />
                        </a>
                        <br />
                        <a href="https://www.facebook.com/" className="inline-block text-gray-900 fs-5 me-2">
                            <i className="bi bi-facebook me-1" />
                        </a>
                        <br />
                        <a href="<?php echo $contact_r['insta'] ?>" className="inline-block text-gray-900 fs-5">
                            <i className="bi bi-instagram me-1" />
                        </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Contact;