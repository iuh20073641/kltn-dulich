import { Link } from "react-router-dom";

function NewsItem({ id, title, summary, image }) {
  return (
    <div className="news-item">
      <Link to={`/news/${id}`}>
        {" "}
        {/* Sử dụng id đúng cách */}
        <img src={image} alt={title} />
        <h3>{title}</h3>
        <p>{summary}</p>
      </Link>
    </div>
  );
}

export default NewsItem;
