import { useEffect, useState } from "react";
import Header from "../header";
import Footer from "../footer/footer";
import NewsList from "./NewsList";
import "./style.css"; // Import file CSS

function News() {
  const [articles, setArticles] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:88/api_travel/api/news.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data); // Kiểm tra dữ liệu nhận được
        setArticles(data);
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        // setLoading(false);
      });
  }, [articles]);

  if (error) {
    return <div className="news">Có lỗi xảy ra: {error.message}</div>;
  }

  return (
    <div className="page-container">
      <Header />
      <div className="">
        <div className="font-semibold text-2xl uppercase">Tin Tức</div>
        <div className="mt-[120px] flex w-[80%] max-w-[1200px] mx-auto h-screen">
          <NewsList articles={articles} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default News;
