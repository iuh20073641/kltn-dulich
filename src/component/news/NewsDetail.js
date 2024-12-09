import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../header";
import Footer from "../footer/footer";
import "./style.css"; // Import file CSS
import config from "../../component/config.json";

const { SERVER_API } = config;

function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SERVER_API}/news.php?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Kiểm tra dữ liệu nhận được
        if (data.length > 0) {
          setArticle(data[0]); // Lấy bài viết đầu tiên từ mảng
        } else {
          setArticle(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="news">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="news">Có lỗi xảy ra: {error.message}</div>;
  }

  if (!article) {
    return <div className="news">Không tìm thấy bài viết.</div>;
  }

  // Định dạng ngày
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="page-container">
      <Header />
      <div className="content-wrap pt-[140px] w-[95%] mx-auto">
        <div className="article-header">
          <h1 className="font-semibold text-2xl">{article.title}</h1>
          <p className="article-summary">{article.summary}</p>{" "}
          {/* Thêm lớp CSS cho summary */}
          <img
            src={`${SERVER_API}/Images/news/${article.image}`}
            alt={article.title}
            className="article-image"
          />
        </div>
        <div className="w-[80%] h-[2px] bg-gray-200 rounded-md mx-auto my-4"></div>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <div className="article-published_at">
          Đăng ngày: {formatDate(article.published_at)}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NewsDetail;