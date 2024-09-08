
import Header from "../header";
import Section from "../section/section";
import Footer from "../footer/footer";
function Home(){
    return(
        <div className="home">
            {/* <div className="content-wrapper max-w-screen-2xl text-base mx-auto"> */}
                <Header />
                <Section />
                <Footer />
            {/* </div> */}
        </div>
    );
}
export default Home;