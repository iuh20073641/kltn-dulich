import './footer.css';
function Footer(){
    return(
        <footer className=" mx-auto pb-24 bg-[rgba(28,41,48,1)]">
            <div className="w-[95%] mx-auto pt-11">
                <div className="flex gap-8">
                    <div className="basis-2/6">
                        <div className="font-semibold text-2xl mb-8 text-[rgba(255,255,255,1.00)]">TravelVN</div>
                        <div className="text-gray-400 text-sm">
                            Delivering the best coffee life since 1996. From coffee geeks to the
                            real ones.
                        </div>
                        <div className="text-gray-300 mb-4">Hung Inc. © 1996</div>
                    </div>
                    <div className="basis-2/6" />
                    <div className="basis-1/6">
                        <div className="uppercase font-semibold mb-4 text-[rgba(255,255,255,1.00)] text-left">Menu</div>
                        <div className="travel-footer-menu text-gray-400 text-left mx-auto">
                            <div>
                                <a href="https://www.facebook.com/">Home</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">Our Products</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">About</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">Contact</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">Styleguide</a>
                            </div>
                        </div>
                    </div>
                    <div className="basis-1/6">
                        <div className="uppercase font-semibold mb-4 text-[rgba(255,255,255,1.00)] text-left">follow us</div>
                        <div className="travel-footer-flollow text-gray-400 text-left">
                            <div>
                                <a href="https://www.facebook.com/">Facebook</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">Instagram</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">Pinterest</a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">Twitter</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}
export default Footer;