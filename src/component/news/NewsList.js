import NewsItem from "./NewsItem";

function NewsList({ articles }) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return <div className="news-list">Không có bài viết nào.</div>;
  }

  return (
    <div className="news-list">
      {articles.map((article, index) => (
        <NewsItem
          key={index}
          id={article.id} // Truyền id đúng cách
          title={article.title}
          summary={article.summary}
          image={article.image}
        />
      ))}
    </div>
  );
}

export default NewsList;
